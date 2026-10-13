import type { Request, Response } from 'express';

// Explicit lightweight health check independent of the catch-all API route.
export default function handler(_req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    service: 'EMICODE API',
    timestamp: new Date().toISOString()
  });
}
