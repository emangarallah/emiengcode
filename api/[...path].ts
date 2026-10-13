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

// Vercel routing can pass either the full /api/... path or a function-relative path.
// Normalize both forms so admin login and the other API endpoints resolve consistently.
app.use((req, _res, next) => {
  const incomingUrl = req.url || '/';
  const pathname = incomingUrl.split('?')[0] || '/';

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
