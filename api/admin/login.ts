import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { api } from '../../server/api.ts';

// Explicit Vercel function for the admin login endpoint.
// The shared router is reused so credential checks, rate limiting, HttpOnly cookies,
// notifications, and Neon-backed account lookup remain identical to the main API.
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Vercel may invoke this function with "/" or keep the original path. Normalize
// both forms to the shared Express router's /admin/login route.
app.use((req: Request, res: Response, next: NextFunction) => {
  const incomingUrl = req.url || '/';
  const queryIndex = incomingUrl.indexOf('?');
  const pathname = queryIndex >= 0 ? incomingUrl.slice(0, queryIndex) : incomingUrl;
  const query = queryIndex >= 0 ? incomingUrl.slice(queryIndex) : '';

  if (pathname === '/' || pathname === '/login' || pathname === '/admin/login/' || pathname === '/api/admin/login') {
    req.url = '/admin/login' + query;
  } else if (pathname !== '/admin/login') {
    return res.status(404).json({ error: 'مسار تسجيل الدخول غير موجود.', code: 'ADMIN_LOGIN_ROUTE_NOT_FOUND' });
  }

  next();
});

app.use(api);
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'مسار API غير موجود.', code: 'API_ROUTE_NOT_FOUND' });
});

export default app;
