import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { AdminUser, ContactRequest, Profile, Project, Service } from './types.ts';
import { store, TEMPLATE_PROJECTS, VERCEL_SHOWCASE_PROJECTS, SERVICE_TEMPLATE_PROJECTS } from './store.ts';

const { Pool } = pg;

interface DbStatus {
  connected: boolean;
  type: 'neon_postgresql' | 'resilient_local';
  message: string;
  databaseUrlSet: boolean;
  projectCount: number;
  contactCount: number;
}

class DatabaseManager {
  private pool: pg.Pool | null = null;
  private isNeonActive: boolean = false;
  private statusMessage: string = 'Initializing database...';
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.init();
  }

  async waitUntilInitialized(): Promise<boolean> {
    await this.initPromise;
    return this.isNeonConnected();
  }

  isNeonConnected(): boolean {
    return this.isNeonActive && Boolean(this.pool);
  }

  private async init() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.trim() === '' || dbUrl.includes('MY_DATABASE_URL')) {
      this.isNeonActive = false;
      this.statusMessage = 'DATABASE_URL is missing or still contains a placeholder. Configure a valid Neon PostgreSQL connection string.';
      console.warn('[DB] DATABASE_URL is missing or still contains a placeholder; Neon PostgreSQL is not configured.');
      return;
    }

    let phase: 'connection' | 'schema initialization' = 'connection';

    try {
      console.log('[DB] Attempting connection to Neon PostgreSQL...');
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });

      this.pool.on('error', (err) => {
        const safeMessage = String(err?.message ?? err)
          .replace(/postgres(?:ql)?:\/\/[^\s@]+@[^\s]+/gi, 'postgresql://[redacted]')
          .replace(/[\r\n]+/g, ' ')
          .slice(0, 500);
        console.warn('[DB] Handled idle Neon PostgreSQL client error:', safeMessage);
      });

      const client = await this.pool.connect();
      try {
        await client.query('SELECT NOW()');
        phase = 'schema initialization';
        await this.ensureNeonSchema(client);

        this.isNeonActive = true;
        this.statusMessage = 'Connected successfully to Neon PostgreSQL database.';
        console.log('[DB] Neon PostgreSQL connection and schema initialization succeeded.');
      } finally {
        client.release();
      }
    } catch (err: any) {
      this.isNeonActive = false;
      const errorCode = typeof err?.code === 'string' ? err.code : '';
      const safeMessage = String(err?.message ?? err)
        .replace(/postgres(?:ql)?:\/\/[^\s@]+@[^\s]+/gi, 'postgresql://[redacted]')
        .replace(/[\r\n]+/g, ' ')
        .slice(0, 500);

      this.statusMessage = `Neon PostgreSQL ${phase} failed. Verify DATABASE_URL, database credentials, network access, and schema permissions.`;
      console.error(
        `[DB] Neon PostgreSQL ${phase} failed${errorCode ? ` (code ${errorCode})` : ''}: ${safeMessage}`
      );

      const failedPool = this.pool;
      this.pool = null;
      if (failedPool) {
        await failedPool.end().catch(() => undefined);
      }
    }
  }

  private async ensureEnvironmentAdmin(client: pg.PoolClient) {
    const rawEmail = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const email = rawEmail?.trim().toLowerCase();

    // Environment-based bootstrap is opt-in. Never create a built-in/default account.
    if (!email && !password) return;

    if (
      !email ||
      !password ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.endsWith('@example.com') ||
      password.length < 12 ||
      password.toLowerCase().includes('replace-me')
    ) {
      console.warn('[DB] Initial admin bootstrap skipped: set a real ADMIN_EMAIL and a strong ADMIN_PASSWORD (12+ characters).');
      return;
    }

    if (typeof process.env.JWT_SECRET !== 'string' || process.env.JWT_SECRET.length < 32) {
      console.warn('[DB] Initial admin bootstrap skipped: JWT_SECRET must contain at least 32 characters.');
      return;
    }

    const existing = await client.query(
      'SELECT id FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email]
    );
    if (existing.rows.length > 0) return;

    const passwordHash = await bcrypt.hash(password, 12);
    const inserted = await client.query(
      `INSERT INTO admins (email, "passwordHash", role)
       VALUES ($1, $2, 'superadmin')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email, passwordHash]
    );

    if (inserted.rowCount) {
      console.log('[DB] Created the configured initial superadmin account.');
    }
  }

  private async ensureNeonSchema(client: pg.PoolClient) {
    try {
      // Create tables if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          "shortDescription" TEXT NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          technologies TEXT[] NOT NULL DEFAULT '{}',
          "coverImage" TEXT NOT NULL,
          gallery TEXT[] NOT NULL DEFAULT '{}',
          "liveUrl" TEXT,
          "githubUrl" TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'completed',
          featured BOOLEAN NOT NULL DEFAULT false,
          "sortOrder" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS admins (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          "passwordHash" TEXT NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'admin',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS services (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          icon VARCHAR(100) NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "sortOrder" INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS contact_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          "serviceType" VARCHAR(100) NOT NULL,
          budget VARCHAR(100),
          message TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'new',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS profile (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "displayName" VARCHAR(255) NOT NULL,
          headline TEXT NOT NULL,
          bio TEXT NOT NULL,
          email VARCHAR(255) NOT NULL,
          whatsapp VARCHAR(100) NOT NULL,
          "githubUrl" TEXT,
          "linkedinUrl" TEXT,
          "resumeUrl" TEXT
        );

        -- Relational schema migrations
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS "serviceId" UUID REFERENCES services(id) ON DELETE SET NULL;
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS "isTemplate" BOOLEAN NOT NULL DEFAULT true;

        ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS "phone" VARCHAR(100);
        ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS "serviceId" UUID REFERENCES services(id) ON DELETE SET NULL;
        ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS "timeline" VARCHAR(100);
        ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS "additionalFeatures" TEXT;
        ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS "referenceProject" VARCHAR(255);
      `);

      // Create a first superadmin only when explicit private environment credentials exist.
      // Existing accounts are never reset by ordinary application startup.
      await this.ensureEnvironmentAdmin(client);

      // Remove only the small, explicit list of known legacy demo artifacts.
      // Customer requests are never deleted by matching email domains or other heuristics.
      await client.query(
        "DELETE FROM projects WHERE slug IN ('emiflow-saas-erp', 'medilink-telehealth', 'albayan-flutter-app', 'finpulse-crypto-analytics', 'hypergate-api-gateway', 'dartech-estate-crm')"
      );

      // Retire only Vercel catalogue entries whose projects no longer exist in this team.
      // emicode-nu.vercel.app is retained: Vercel confirms it is an alias of the existing
      // "emicode" project, not a separate removed project.
      await client.query(
        "DELETE FROM projects WHERE slug IN ('vercel-emicodin-eng', 'vercel-emicodin-na9l')"
      );

      // Services are seeded once only when the table is empty. Preserve their stable IDs
      // so demo templates can be linked by service title rather than assuming legacy IDs.
      const servicesCheck = await client.query('SELECT COUNT(*) FROM services');
      if (parseInt(servicesCheck.rows[0].count, 10) === 0) {
        const seeds = store.getSeedData();
        for (const s of seeds.services) {
          await client.query(
            `INSERT INTO services (id, title, description, icon, "isActive", "sortOrder")
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [s.id, s.title, s.description, s.icon, s.isActive, s.sortOrder]
          );
        }
      }

      // Seed project examples once. Do not overwrite the administrator's edits on startup,
      // and do not recreate a template after the administrator intentionally deletes it.
      await client.query(`
        CREATE TABLE IF NOT EXISTS app_seed_state (
          seed_key VARCHAR(100) PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const templateSeedState = await client.query(
        "SELECT seed_key FROM app_seed_state WHERE seed_key = 'service-linked-project-templates-v1' LIMIT 1"
      );
      if (templateSeedState.rows.length === 0) {
        for (const p of TEMPLATE_PROJECTS) {
          let resolvedServiceId: string | null = null;
          if (p.serviceTitle) {
            const serviceResult = await client.query(
              'SELECT id FROM services WHERE title = $1 ORDER BY "sortOrder" ASC LIMIT 1',
              [p.serviceTitle]
            );
            resolvedServiceId = serviceResult.rows[0]?.id ?? null;
          }

          await client.query(`
            INSERT INTO projects (
              id, title, slug, "shortDescription", description, category,
              technologies, "coverImage", gallery, "liveUrl", "githubUrl",
              status, featured, "sortOrder", "isTemplate", "serviceId", "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            ON CONFLICT DO NOTHING
          `, [
            p.id, p.title, p.slug, p.shortDescription, p.description, p.category,
            p.technologies, p.coverImage, p.gallery, p.liveUrl || null, p.githubUrl || null,
            p.status, p.featured, p.sortOrder, true, resolvedServiceId, p.createdAt, p.updatedAt
          ]);
        }
        await client.query(
          "INSERT INTO app_seed_state (seed_key) VALUES ('service-linked-project-templates-v1') ON CONFLICT DO NOTHING"
        );
      }

      // Seed new Vercel entries and per-service examples independently from the
      // original template seed key, which may already exist in production databases.
      const seedProjectCatalog = async (seedKey: string, projects: Project[]) => {
        const state = await client.query(
          'SELECT seed_key FROM app_seed_state WHERE seed_key = $1 LIMIT 1',
          [seedKey]
        );
        if (state.rows.length > 0) return;

        for (const p of projects) {
          let resolvedServiceId: string | null = null;
          if (p.serviceTitle) {
            const serviceResult = await client.query(
              'SELECT id FROM services WHERE title = $1 ORDER BY "sortOrder" ASC LIMIT 1',
              [p.serviceTitle]
            );
            resolvedServiceId = serviceResult.rows[0]?.id ?? null;
          }
          if (!resolvedServiceId && p.serviceId) {
            const serviceById = await client.query(
              'SELECT id FROM services WHERE id = $1 LIMIT 1',
              [p.serviceId]
            );
            resolvedServiceId = serviceById.rows[0]?.id ?? null;
          }

          await client.query(`
            INSERT INTO projects (
              id, title, slug, "shortDescription", description, category,
              technologies, "coverImage", gallery, "liveUrl", "githubUrl",
              status, featured, "sortOrder", "isTemplate", "serviceId", "createdAt", "updatedAt"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            ON CONFLICT DO NOTHING
          `, [
            p.id, p.title, p.slug, p.shortDescription, p.description, p.category,
            p.technologies, p.coverImage, p.gallery, p.liveUrl || null, p.githubUrl || null,
            p.status, p.featured, p.sortOrder, p.isTemplate ?? false, resolvedServiceId, p.createdAt, p.updatedAt
          ]);
        }

        await client.query(
          'INSERT INTO app_seed_state (seed_key) VALUES ($1) ON CONFLICT DO NOTHING',
          [seedKey]
        );
      };

      await seedProjectCatalog('vercel-projects-showcase-v1', VERCEL_SHOWCASE_PROJECTS);
      await seedProjectCatalog('per-service-demo-templates-v1', SERVICE_TEMPLATE_PROJECTS);

      // Do not seed invented profile details on a fresh database. The owner can
      // add real contact/profile information through the protected admin panel.

      // Never create or reset administrator accounts during ordinary server startup.
      // The initial administrator must be created explicitly with scripts/setup-admin.ts.
    } catch (schemaErr) {
      console.error('[DB] Unable to initialize the Neon PostgreSQL schema.');
      throw schemaErr;
    }
  }

  async getStatus(): Promise<DbStatus> {
    const projects = await this.getProjects();
    const contacts = await this.getContactRequests();

    return {
      connected: this.isNeonActive,
      type: this.isNeonActive ? 'neon_postgresql' : 'resilient_local',
      message: this.statusMessage,
      databaseUrlSet: Boolean(process.env.DATABASE_URL),
      projectCount: projects.length,
      contactCount: contacts.length
    };
  }

  // --- Projects ---
  async getProjects(filters?: { search?: string; category?: string; status?: string }): Promise<Project[]> {
    if (this.isNeonActive && this.pool) {
      try {
        let query = 'SELECT projects.*, (SELECT title FROM services WHERE id = projects."serviceId" LIMIT 1) AS "serviceTitle" FROM projects WHERE 1=1';
        const params: any[] = [];

        if (filters?.category && filters.category !== 'all') {
          params.push(filters.category);
          query += ` AND category = $${params.length}`;
        }

        if (filters?.status && filters.status !== 'all') {
          params.push(filters.status);
          query += ` AND status = $${params.length}`;
        }

        if (filters?.search && filters.search.trim()) {
          params.push(`%${filters.search.trim().toLowerCase()}%`);
          query += ` AND (LOWER(title) LIKE $${params.length} OR LOWER("shortDescription") LIKE $${params.length})`;
        }

        query += ' ORDER BY "sortOrder" ASC, "createdAt" DESC';
        const res = await this.pool.query(query, params);
        return res.rows.map(row => ({
          ...row,
          isTemplate: row.status === 'prototype' || Boolean(row.isTemplate),
          technologies: row.technologies || [],
          gallery: row.gallery || [],
          createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString()
        }));
      } catch (err) {
        console.warn('[DB] Fallback to store on query error:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }

    let items = store.getProjects();
    if (filters?.category && filters.category !== 'all') {
      items = items.filter(p => p.category === filters.category);
    }
    if (filters?.status && filters.status !== 'all') {
      items = items.filter(p => p.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      items = items.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }
    return items;
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('SELECT projects.*, (SELECT title FROM services WHERE id = projects."serviceId" LIMIT 1) AS "serviceTitle" FROM projects WHERE slug = $1 LIMIT 1', [slug]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            ...row,
            isTemplate: row.status === 'prototype' || Boolean(row.isTemplate),
            technologies: row.technologies || [],
            gallery: row.gallery || [],
            createdAt: new Date(row.createdAt).toISOString(),
            updatedAt: new Date(row.updatedAt).toISOString()
          };
        }
      } catch (err) {
        console.warn('[DB] Fallback to store on getProjectBySlug:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.getProjectBySlug(slug);
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query(
          `INSERT INTO projects (title, slug, "shortDescription", description, category, technologies, "coverImage", gallery, "liveUrl", "githubUrl", status, featured, "sortOrder", "serviceId", "isTemplate")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           RETURNING *`,
          [
            project.title,
            project.slug,
            project.shortDescription,
            project.description,
            project.category,
            project.technologies,
            project.coverImage,
            project.gallery,
            project.liveUrl || null,
            project.githubUrl || null,
            project.status,
            project.featured,
            project.sortOrder || 0,
            project.serviceId || null,
            project.isTemplate ?? false
          ]
        );
        const row = res.rows[0];
        return {
          ...row,
          technologies: row.technologies || [],
          gallery: row.gallery || []
        };
      } catch (err) {
        console.warn('[DB] Error writing to Neon, fallback to store:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.createProject(project);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (this.isNeonActive && this.pool) {
      try {
        const current = await this.pool.query('SELECT * FROM projects WHERE id = $1', [id]);
        if (current.rows.length === 0) return null;
        const cur = current.rows[0];

        const res = await this.pool.query(
          `UPDATE projects SET
            title = COALESCE($1, title),
            slug = COALESCE($2, slug),
            "shortDescription" = COALESCE($3, "shortDescription"),
            description = COALESCE($4, description),
            category = COALESCE($5, category),
            technologies = COALESCE($6, technologies),
            "coverImage" = COALESCE($7, "coverImage"),
            gallery = COALESCE($8, gallery),
            "liveUrl" = $9,
            "githubUrl" = $10,
            status = COALESCE($11, status),
            featured = COALESCE($12, featured),
            "sortOrder" = COALESCE($13, "sortOrder"),
            "serviceId" = CASE WHEN $14::boolean THEN $15::uuid ELSE "serviceId" END,
            "isTemplate" = COALESCE($16, "isTemplate"),
            "updatedAt" = CURRENT_TIMESTAMP
           WHERE id = $17
           RETURNING *`,
          [
            updates.title,
            updates.slug,
            updates.shortDescription,
            updates.description,
            updates.category,
            updates.technologies,
            updates.coverImage,
            updates.gallery,
            updates.liveUrl !== undefined ? updates.liveUrl : cur.liveUrl,
            updates.githubUrl !== undefined ? updates.githubUrl : cur.githubUrl,
            updates.status,
            updates.featured,
            updates.sortOrder,
            updates.serviceId !== undefined,
            updates.serviceId ?? null,
            updates.isTemplate,
            id
          ]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[DB] Update Neon error, fallback to store:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.updateProject(id, updates);
  }

  async deleteProject(id: string): Promise<boolean> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('DELETE FROM projects WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
      } catch (err) {
        console.warn('[DB] Delete Neon error, fallback to store:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.deleteProject(id);
  }

  // --- Services ---
  async getServices(onlyActive = false): Promise<Service[]> {
    if (this.isNeonActive && this.pool) {
      try {
        const query = onlyActive
          ? 'SELECT * FROM services WHERE "isActive" = true ORDER BY "sortOrder" ASC'
          : 'SELECT * FROM services ORDER BY "sortOrder" ASC';
        const res = await this.pool.query(query);
        return res.rows;
      } catch (err) {
        console.warn('[DB] Services query fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.getServices(onlyActive);
  }

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query(
          `INSERT INTO services (title, description, icon, "isActive", "sortOrder")
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [service.title, service.description, service.icon, service.isActive, service.sortOrder]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[DB] Create service error fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.createService(service);
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query(
          `UPDATE services SET
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            icon = COALESCE($3, icon),
            "isActive" = COALESCE($4, "isActive"),
            "sortOrder" = COALESCE($5, "sortOrder")
           WHERE id = $6 RETURNING *`,
          [updates.title, updates.description, updates.icon, updates.isActive, updates.sortOrder, id]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[DB] Update service error fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.updateService(id, updates);
  }

  async deleteService(id: string): Promise<boolean> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('DELETE FROM services WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
      } catch (err) {
        console.warn('[DB] Delete service fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.deleteService(id);
  }

  // --- Contacts ---
  async getContactRequests(): Promise<ContactRequest[]> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM contact_requests ORDER BY "createdAt" DESC');
        return res.rows.map(r => ({
          ...r,
          createdAt: new Date(r.createdAt).toISOString()
        }));
      } catch (err) {
        console.warn('[DB] Contacts query fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.getContactRequests();
  }

  async createContactRequest(req: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>): Promise<ContactRequest> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query(
          `INSERT INTO contact_requests
            (name, email, phone, "serviceType", "serviceId", budget, timeline, "additionalFeatures", "referenceProject", message)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [
            req.name,
            req.email,
            req.phone || null,
            req.serviceType,
            req.serviceId || null,
            req.budget || null,
            req.timeline || null,
            req.additionalFeatures || null,
            req.referenceProject || null,
            req.message
          ]
        );
        const row = res.rows[0];
        return {
          ...row,
          createdAt: new Date(row.createdAt).toISOString()
        };
      } catch (err) {
        console.warn('[DB] Contact submission error fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.createContactRequest(req);
  }

  async updateContactStatus(id: string, status: ContactRequest['status']): Promise<ContactRequest | null> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query(
          `UPDATE contact_requests SET status = $1 WHERE id = $2 RETURNING *`,
          [status, id]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[DB] Contact update fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.updateContactStatus(id, status);
  }

  async deleteContactRequest(id: string): Promise<boolean> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('DELETE FROM contact_requests WHERE id = $1', [id]);
        return (res.rowCount ?? 0) > 0;
      } catch (err) {
        console.warn('[DB] Contact delete fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.deleteContactRequest(id);
  }

  // --- Profile ---
  async getProfile(): Promise<Profile> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM profile LIMIT 1');
        if (res.rows.length > 0) return res.rows[0];
        return {
          id: '',
          displayName: '',
          headline: '',
          bio: '',
          email: '',
          whatsapp: '',
          githubUrl: null,
          linkedinUrl: null,
          resumeUrl: null
        };
      } catch {
        console.warn('[DB] Unable to load profile from Neon.');
        throw new Error('Unable to load profile');
      }
    }
    return store.getProfile();
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (this.isNeonActive && this.pool) {
      try {
        const existing = await this.getProfile();
        const merged = {
          ...existing,
          ...updates,
          displayName: updates.displayName ?? existing.displayName,
          headline: updates.headline ?? existing.headline,
          bio: updates.bio ?? existing.bio,
          email: updates.email ?? existing.email,
          whatsapp: updates.whatsapp ?? existing.whatsapp
        };
        if (!existing.id) {
          const inserted = await this.pool.query(
            `INSERT INTO profile ("displayName", headline, bio, email, whatsapp, "githubUrl", "linkedinUrl", "resumeUrl")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [merged.displayName, merged.headline, merged.bio, merged.email, merged.whatsapp, merged.githubUrl, merged.linkedinUrl, merged.resumeUrl]
          );
          return inserted.rows[0];
        }
        const updated = await this.pool.query(
          `UPDATE profile SET
            "displayName" = $1,
            headline = $2,
            bio = $3,
            email = $4,
            whatsapp = $5,
            "githubUrl" = $6,
            "linkedinUrl" = $7,
            "resumeUrl" = $8
           WHERE id = $9 RETURNING *`,
          [merged.displayName, merged.headline, merged.bio, merged.email, merged.whatsapp, merged.githubUrl, merged.linkedinUrl, merged.resumeUrl, merged.id]
        );
        return updated.rows[0] ?? merged;
      } catch (err) {
        console.warn('[DB] Profile update fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.updateProfile(updates);
  }

  // --- Admin Auth ---
  async findAdminByEmail(email: string): Promise<AdminUser | null> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash,
            role: row.role,
            createdAt: new Date(row.createdAt).toISOString()
          };
        }
      } catch (err) {
        console.warn('[DB] Find admin fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.findAdminByEmail(email);
  }

  async findAdminById(id: string): Promise<AdminUser | null> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query('SELECT * FROM admins WHERE id = $1 LIMIT 1', [id]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash,
            role: row.role,
            createdAt: new Date(row.createdAt).toISOString()
          };
        }
      } catch (err) {
        console.warn('[DB] Find admin by id fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.findAdminById(id);
  }

  async updateAdminPassword(adminId: string, newPasswordHash: string): Promise<boolean> {
    if (this.isNeonActive && this.pool) {
      try {
        const res = await this.pool.query(
          'UPDATE admins SET "passwordHash" = $1 WHERE id = $2',
          [newPasswordHash, adminId]
        );
        return (res.rowCount ?? 0) > 0;
      } catch (err) {
        console.warn('[DB] Update admin password fallback:', err);
        if (process.env.NODE_ENV === 'production') throw err;
      }
    }
    return store.updateAdminPassword(adminId, newPasswordHash);
  }
}

export const db = new DatabaseManager();
