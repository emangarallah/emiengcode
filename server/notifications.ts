import 'dotenv/config';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 15000,
      connectionTimeoutMillis: 5000
    })
  : null;

let schemaPromise: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  if (!pool) throw new Error('DATABASE_URL is required for persistent notifications.');
  if (!schemaPromise) {
    schemaPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient_role VARCHAR(32) NOT NULL,
        recipient_key VARCHAR(128),
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(64) NOT NULL DEFAULT 'info',
        entity_type VARCHAR(64),
        entity_id VARCHAR(128),
        target_url TEXT,
        read_at TIMESTAMPTZ,
        dedupe_key VARCHAR(255) UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS notifications_recipient_created_idx
        ON notifications (recipient_role, recipient_key, created_at DESC);
      CREATE INDEX IF NOT EXISTS notifications_unread_idx
        ON notifications (recipient_role, recipient_key, read_at);
      CREATE TABLE IF NOT EXISTS client_request_access (
        contact_id UUID PRIMARY KEY REFERENCES contact_requests(id) ON DELETE CASCADE,
        token_hash VARCHAR(64) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).then(() => undefined).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export type AdminNoticeRole = 'admin' | 'superadmin';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  entityType: string | null;
  entityId: string | null;
  targetUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

function mapRow(row: any): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    entityType: row.entity_type ?? null,
    entityId: row.entity_id ?? null,
    targetUrl: row.target_url ?? null,
    readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString()
  };
}

async function insertNotification(input: {
  role: string;
  key?: string | null;
  title: string;
  message: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  targetUrl?: string | null;
  dedupeKey?: string | null;
}): Promise<void> {
  await ensureSchema();
  await pool!.query(
    `INSERT INTO notifications
      (recipient_role, recipient_key, title, message, type, entity_type, entity_id, target_url, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (dedupe_key) DO NOTHING`,
    [
      input.role,
      input.key ?? null,
      input.title,
      input.message,
      input.type,
      input.entityType ?? null,
      input.entityId ?? null,
      input.targetUrl ?? null,
      input.dedupeKey ?? null
    ]
  );
}

type NotificationWrite = {
  role: string;
  key?: string | null;
  title: string;
  message: string;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  targetUrl?: string | null;
  dedupeKey?: string | null;
};

async function insertNotificationInTransaction(client: pg.PoolClient, input: NotificationWrite): Promise<void> {
  await client.query(
    `INSERT INTO notifications
      (recipient_role, recipient_key, title, message, type, entity_type, entity_id, target_url, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (dedupe_key) DO NOTHING`,
    [input.role, input.key ?? null, input.title, input.message, input.type,
      input.entityType ?? null, input.entityId ?? null, input.targetUrl ?? null, input.dedupeKey ?? null]
  );
}

export interface ContactNotificationInput {
  name: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  serviceId?: string | null;
  budget?: string | null;
  timeline?: string | null;
  additionalFeatures?: string | null;
  referenceProject?: string | null;
  message: string;
}

/**
 * Save the request, its scoped client-access token, and recipient notices
 * atomically. A failed notice write rolls back the request as well.
 */
export async function createContactRequestWithNotifications(input: ContactNotificationInput): Promise<{ request: any; trackingToken: string }> {
  await ensureSchema();
  const client = await pool!.connect();
  const trackingToken = randomBytes(32).toString('hex');
  const tokenHash = hashToken(trackingToken);

  try {
    await client.query('BEGIN');
    const inserted = await client.query(
      `INSERT INTO contact_requests
        (name, email, phone, "serviceType", "serviceId", budget, timeline, "additionalFeatures", "referenceProject", message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [input.name, input.email, input.phone ?? null, input.serviceType, input.serviceId ?? null,
        input.budget ?? null, input.timeline ?? null, input.additionalFeatures ?? null,
        input.referenceProject ?? null, input.message]
    );
    const request = inserted.rows[0];
    if (!request?.id) throw new Error('Contact request was not created.');

    await client.query(
      `INSERT INTO client_request_access (contact_id, token_hash) VALUES ($1, $2)`,
      [request.id, tokenHash]
    );

    const base = `contact-created:${request.id}`;
    const notices: NotificationWrite[] = [
      {
        role: 'client', key: tokenHash, title: 'تم استلام طلبك',
        message: `استلمنا طلبك لخدمة «${input.serviceType}» بنجاح. يمكنك متابعة حالته من جرس الإشعارات في هذا المتصفح.`,
        type: 'request_created', entityType: 'contact_request', entityId: request.id,
        targetUrl: '#contact', dedupeKey: `${base}:client`
      },
      {
        role: 'admin', title: 'طلب خدمة جديد',
        message: `وصل طلب جديد من ${input.name} بخصوص خدمة «${input.serviceType}».`,
        type: 'request_created', entityType: 'contact_request', entityId: request.id,
        targetUrl: '/admin#contacts', dedupeKey: `${base}:admin`
      },
      {
        role: 'superadmin', title: 'طلب عميل جديد — إشعار المبرمج',
        message: `وصل طلب جديد من ${input.name} بخصوص خدمة «${input.serviceType}».`,
        type: 'request_created', entityType: 'contact_request', entityId: request.id,
        targetUrl: '/admin#contacts', dedupeKey: `${base}:superadmin`
      }
    ];
    for (const notice of notices) await insertNotificationInTransaction(client, notice);
    await client.query('COMMIT');

    return {
      request: {
        ...request,
        createdAt: request.createdAt ? new Date(request.createdAt).toISOString() : new Date().toISOString()
      },
      trackingToken
    };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

const statusMessages: Record<string, { title: string; message: string }> = {
  new: { title: 'تم استلام طلبك', message: 'تم تسجيل طلبك بنجاح.' },
  in_review: { title: 'طلبك قيد المراجعة', message: 'بدأت مراجعة طلبك، وسنوافيك بأي تحديث جديد.' },
  accepted: { title: 'تم قبول طلبك', message: 'تم قبول طلبك. سيتم التواصل معك لمتابعة الخطوات التالية.' },
  rejected: { title: 'تحديث بخصوص طلبك', message: 'نعتذر، لم نتمكن من قبول طلبك في الوقت الحالي. يمكنك التواصل معنا للاستفسار.' },
  contacted: { title: 'تحديث بخصوص طلبك', message: 'تم تحديث حالة طلبك إلى «تم التواصل». راجع وسيلة التواصل التي قدمتها.' },
  completed: { title: 'اكتمل طلبك', message: 'تم تحديث حالة طلبك إلى «مكتمل».' },
  archived: { title: 'تحديث بخصوص طلبك', message: 'تم أرشفة طلبك. يمكنك التواصل معنا عند الحاجة.' }
};

/**
 * Update request state and persist its client/developer notifications in one
 * Neon transaction. Repeating an unchanged status does not create duplicates.
 */
export async function updateContactStatusWithNotifications(contactId: string, status: string): Promise<any | null> {
  await ensureSchema();
  const client = await pool!.connect();
  try {
    await client.query('BEGIN');
    const currentResult = await client.query(
      'SELECT * FROM contact_requests WHERE id = $1 FOR UPDATE',
      [contactId]
    );
    const current = currentResult.rows[0];
    if (!current) {
      await client.query('ROLLBACK');
      return null;
    }

    if (current.status === status) {
      await client.query('COMMIT');
      return {
        ...current,
        createdAt: current.createdAt ? new Date(current.createdAt).toISOString() : new Date().toISOString()
      };
    }

    const updatedResult = await client.query(
      'UPDATE contact_requests SET status = $2 WHERE id = $1 RETURNING *',
      [contactId, status]
    );
    const updated = updatedResult.rows[0];
    const statusInfo = statusMessages[status] || {
      title: 'تحديث بخصوص طلبك',
      message: 'تم تحديث حالة طلبك.'
    };
    const access = await client.query(
      'SELECT token_hash FROM client_request_access WHERE contact_id = $1 LIMIT 1',
      [contactId]
    );
    const eventId = randomUUID();
    const dedupeBase = `contact-status:${contactId}:${eventId}`;

    if (access.rows[0]?.token_hash) {
      await insertNotificationInTransaction(client, {
        role: 'client', key: access.rows[0].token_hash,
        title: statusInfo.title, message: statusInfo.message,
        type: 'request_status', entityType: 'contact_request', entityId: contactId,
        targetUrl: '#contact', dedupeKey: `${dedupeBase}:client`
      });
    }
    const adminStatusNotice = {
      title: 'تم تحديث حالة طلب',
      message: `تم تحديث حالة أحد الطلبات إلى «${status}» بواسطة لوحة الإدارة.`,
      type: 'request_status',
      entityType: 'contact_request',
      entityId: contactId,
      targetUrl: '/admin#contacts'
    };
    await insertNotificationInTransaction(client, {
      role: 'admin', ...adminStatusNotice, dedupeKey: `${dedupeBase}:admin`
    });
    await insertNotificationInTransaction(client, {
      role: 'superadmin', ...adminStatusNotice, dedupeKey: `${dedupeBase}:superadmin`
    });

    await client.query('COMMIT');
    return {
      ...updated,
      createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString()
    };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function notifySystemFailure(eventKey: string, safeDescription: string): Promise<void> {
  // Pass only static, non-sensitive descriptions. Never pass exception messages or secrets.
  const safeKey = eventKey.replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 120);
  if (!safeKey) return;
  await insertNotification({
    role: 'superadmin',
    title: 'تنبيه تشغيلي للنظام',
    message: safeDescription.slice(0, 500),
    type: 'system_error',
    entityType: 'system',
    targetUrl: '/admin#db',
    dedupeKey: `system-failure:${safeKey}:${Math.floor(Date.now() / 60000)}`
  });
}

export async function listAdminNotifications(role: AdminNoticeRole, includeRead = false): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  await ensureSchema();
  const rows = await pool!.query(
    `SELECT id, title, message, type, entity_type, entity_id, target_url, read_at, created_at
       FROM notifications
      WHERE recipient_role = $1 AND ($2::boolean = TRUE OR read_at IS NULL)
      ORDER BY created_at DESC
      LIMIT 100`,
    [role, includeRead]
  );
  const unread = await pool!.query(
    `SELECT COUNT(*)::int AS count
       FROM notifications
      WHERE read_at IS NULL
        AND recipient_role = $1`,
    [role]
  );
  return { notifications: rows.rows.map(mapRow), unreadCount: unread.rows[0]?.count ?? 0 };
}

export async function markAdminNotificationRead(id: string, role: AdminNoticeRole): Promise<boolean> {
  await ensureSchema();
  const result = await pool!.query(
    `UPDATE notifications SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP)
      WHERE id = $1
        AND recipient_role = $2`,
    [id, role]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function markAllAdminNotificationsRead(role: AdminNoticeRole): Promise<void> {
  await ensureSchema();
  await pool!.query(
    `UPDATE notifications SET read_at = CURRENT_TIMESTAMP
      WHERE read_at IS NULL
        AND recipient_role = $1`,
    [role]
  );
}

async function isValidClientToken(token: string): Promise<string | null> {
  const hashes = await getValidClientTokenHashes([token]);
  return hashes[0] ?? null;
}

async function getValidClientTokenHashes(tokens: string[]): Promise<string[]> {
  await ensureSchema();
  const candidates = [...new Set(tokens.filter((token) => /^[a-f0-9]{64}$/i.test(token)).map(hashToken))];
  if (!candidates.length) return [];
  const result = await pool!.query(
    'SELECT token_hash FROM client_request_access WHERE token_hash = ANY($1::varchar[])',
    [candidates]
  );
  return result.rows.map((row) => row.token_hash as string);
}

export async function getClientRequestDetails(tokens: string[], contactId: string): Promise<{
  id: string;
  serviceType: string;
  message: string;
  status: string;
  createdAt: string;
} | null> {
  const tokenHashes = await getValidClientTokenHashes(tokens);
  if (!tokenHashes.length) return null;
  const result = await pool!.query(
    `SELECT c.id, c."serviceType" AS "serviceType", c.message, c.status, c."createdAt" AS "createdAt"
       FROM contact_requests c
       INNER JOIN client_request_access a ON a.contact_id = c.id
      WHERE c.id = $1 AND a.token_hash = ANY($2::varchar[])
      LIMIT 1`,
    [contactId, tokenHashes]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    serviceType: row.serviceType,
    message: row.message,
    status: row.status,
    createdAt: new Date(row.createdAt).toISOString()
  };
}

export async function listClientNotifications(tokens: string[], includeRead = false): Promise<{ notifications: NotificationItem[]; unreadCount: number } | null> {
  const tokenHashes = await getValidClientTokenHashes(tokens);
  if (!tokenHashes.length) return null;
  const rows = await pool!.query(
    `SELECT id, title, message, type, entity_type, entity_id, target_url, read_at, created_at
       FROM notifications
      WHERE recipient_role = 'client' AND recipient_key = ANY($1::varchar[])
        AND ($2::boolean = TRUE OR read_at IS NULL)
      ORDER BY created_at DESC LIMIT 100`,
    [tokenHashes, includeRead]
  );
  const unread = await pool!.query(
    `SELECT COUNT(*)::int AS count FROM notifications
      WHERE recipient_role = 'client' AND recipient_key = ANY($1::varchar[]) AND read_at IS NULL`,
    [tokenHashes]
  );
  return { notifications: rows.rows.map(mapRow), unreadCount: unread.rows[0]?.count ?? 0 };
}

export async function markClientNotificationRead(tokens: string[], id: string): Promise<boolean> {
  const tokenHashes = await getValidClientTokenHashes(tokens);
  if (!tokenHashes.length) return false;
  const result = await pool!.query(
    `UPDATE notifications SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP)
      WHERE id = $1 AND recipient_role = 'client' AND recipient_key = ANY($2::varchar[])`,
    [id, tokenHashes]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function markAllClientNotificationsRead(tokens: string[]): Promise<boolean> {
  const tokenHashes = await getValidClientTokenHashes(tokens);
  if (!tokenHashes.length) return false;
  await pool!.query(
    `UPDATE notifications SET read_at = CURRENT_TIMESTAMP
      WHERE recipient_role = 'client' AND recipient_key = ANY($1::varchar[]) AND read_at IS NULL`,
    [tokenHashes]
  );
  return true;
}
