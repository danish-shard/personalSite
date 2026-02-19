import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const data = readFileSync(join(__dirname, '../data/projects.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

export default router;
