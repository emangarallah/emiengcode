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
app.use('/api', api);
app.use((_req, res) => {
  res.status(404).json({ error: 'مسار API غير موجود.' });
});

export default app;
