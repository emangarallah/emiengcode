import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

async function setupAdmin() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Error: DATABASE_URL is not set.');
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('Error: Set ADMIN_EMAIL and ADMIN_PASSWORD explicitly in a private environment before running this script.');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Error: ADMIN_PASSWORD must contain at least 8 characters.');
    process.exit(1);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error('Error: ADMIN_EMAIL must be a valid email address.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // This setup script can be run before the web server starts. Create only the
    // minimum required admin table; never seed a default administrator/password.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const passwordHash = bcrypt.hashSync(password, 12);
    
    // Check if admin exists
    const check = await pool.query('SELECT id, email FROM admins WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      await pool.query('UPDATE admins SET "passwordHash" = $1, role = $2 WHERE email = $3', [passwordHash, 'superadmin', email]);
      console.log(`[Admin Setup] Updated existing admin credentials for: ${email}`);
    } else {
      await pool.query(
        'INSERT INTO admins (email, "passwordHash", role) VALUES ($1, $2, $3)',
        [email, passwordHash, 'superadmin']
      );
      console.log(`[Admin Setup] Created new superadmin account for: ${email}`);
    }

    console.log('[Admin Setup] Completed successfully.');
    process.exit(0);
  } catch (err: any) {
    console.error('[Admin Setup] Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupAdmin();
