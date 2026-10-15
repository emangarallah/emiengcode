import express from 'express';
import cookieParser from 'cookie-parser';
import { api } from '../server/api.ts';

// Vercel serverless catch-all for all /api/* routes.
// The same router is used by the local Express server so API behavior stays consistent.
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// The Vercel rewrite forwards the originally requested API route through
// __vercel_path. Restore it before mounting the Express router, while preserving
// any query string the original request included.
app.use((req, _res, next) => {
  const incomingUrl = req.url || '/';
  const parsedUrl = new URL(incomingUrl, 'http://vercel.internal');
  const forwardedPath = parsedUrl.searchParams.get('__vercel_path');

  if (forwardedPath !== null) {
    parsedUrl.searchParams.delete('__vercel_path');
    const normalizedPath = forwardedPath.replace(/^\\/+/, '');
    req.url = `/api/${normalizedPath}${parsedUrl.search}`;
    return next();
  }

  const pathname = parsedUrl.pathname || '/';
  if (pathname !== '/api' && !pathname.startsWith('/api/')) {
    req.url = `/api${incomingUrl.startsWith('/') ? incomingUrl : `/${incomingUrl}`}`;
  }

  next();
});

app.use('/api', api);
app.use((_req, res) => {
  res.status(404).json({ error: 'مسار API غير موجود.', code: 'API_ROUTE_NOT_FOUND' });
});

export default app;
