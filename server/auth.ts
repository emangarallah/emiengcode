import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db.ts';

const JWT_SECRET = process.env.JWT_SECRET;
const hasSecureJwtSecret = () => typeof JWT_SECRET === 'string' && JWT_SECRET.length >= 32;
function requireJwtSecret(): string {
  if (!hasSecureJwtSecret()) {
    throw new Error('JWT_SECRET must be configured with at least 32 random characters.');
  }
  return JWT_SECRET!;
}
const COOKIE_NAME = 'emicode_session';

const OWNER_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getConfiguredOwnerEmail(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email || !OWNER_EMAIL_PATTERN.test(email) || email.endsWith('@example.com')) return null;
  return email;
}

export function hasConfiguredOwnerCredentials(): boolean {
  const email = getConfiguredOwnerEmail();
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(
    email &&
    typeof password === 'string' &&
    password.length >= 12 &&
    !password.toLowerCase().includes('replace-me')
  );
}

export function isConfiguredOwnerEmail(email: string): boolean {
  const ownerEmail = getConfiguredOwnerEmail();
  return Boolean(ownerEmail && email.trim().toLowerCase() === ownerEmail);
}

// Compare the environment secret without ordinary string-comparison timing leakage.
export function verifyConfiguredOwnerPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof expected !== 'string' || expected.length < 12 || expected.toLowerCase().includes('replace-me')) {
    return false;
  }
  const actualBytes = Buffer.from(password, 'utf8');
  const expectedBytes = Buffer.from(expected, 'utf8');
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export interface AdminPayload {
  adminId: string;
  email: string;
  role: string;
  sessionVersion?: string;
}

const OWNER_SESSION_VERSION = 'owner-login-v3';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

// Generate secure JWT token
export function signAdminToken(admin: { id: string; email: string; role: string }): string {
  return jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      sessionVersion: OWNER_SESSION_VERSION
    },
    requireJwtSecret(),
    { expiresIn: '15m' }
  );
}

// Set HttpOnly session cookie
export function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
    // Session cookie: it is removed when the browser session ends.
  });
}

// Clear session cookie
export function clearAuthCookie(res: Response) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
  });
}

// Verify admin session middleware
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!hasConfiguredOwnerCredentials()) {
      return res.status(503).json({ error: 'بيانات دخول مالك المشروع غير مكتملة. تحقق من ADMIN_EMAIL وADMIN_PASSWORD في متغيرات بيئة الخادم.' });
    }
    if (!hasSecureJwtSecret()) {
      return res.status(503).json({ error: 'إعدادات المصادقة غير مكتملة. يرجى ضبط JWT_SECRET في بيئة الخادم.' });
    }
    if (!(await db.waitUntilInitialized())) {
      return res.status(503).json({ error: 'لوحة الإدارة متوقفة مؤقتًا حتى يتوفر اتصال Neon PostgreSQL.' });
    }

    // Extract token from either HttpOnly cookie or Authorization Bearer header
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && typeof req.headers.authorization === 'string') {
      const match = req.headers.authorization.match(/^Bearer\s+(.+)$/i);
      if (match) token = match[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }

    const decoded = jwt.verify(token, requireJwtSecret()) as AdminPayload;
    const admin = await db.findAdminById(decoded.adminId);

    // Only the single owner account configured in Vercel may access administration APIs.
    const ownerEmail = getConfiguredOwnerEmail();
    if (
      decoded.sessionVersion !== OWNER_SESSION_VERSION ||
      !admin ||
      admin.role !== 'superadmin' ||
      !ownerEmail ||
      admin.email.trim().toLowerCase() !== ownerEmail ||
      typeof decoded.email !== 'string' ||
      decoded.email.trim().toLowerCase() !== ownerEmail
    ) {
      return res.status(403).json({ error: 'Forbidden: Owner administrator access required' });
    }

    req.admin = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

// Rate Limiter implementation (in-memory sliding window)
interface RateRecord {
  count: number;
  resetAt: number;
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const records = new Map<string, RateRecord>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || 'unknown';
    const now = Date.now();

    const record = records.get(ip);
    if (!record || now > record.resetAt) {
      records.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      return res.status(429).json({
        error: `عدد الطلبات كبير جدًا. يرجى الانتظار ${waitSeconds} ثانية والمحاولة مجددًا.`
      });
    }

    record.count++;
    next();
  };
}

export { bcrypt };
