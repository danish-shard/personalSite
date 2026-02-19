import { Router, Request, Response } from 'express';

const router = Router();

let count = 0;

router.get('/', (_req: Request, res: Response) => {
  res.json({ count });
});

router.post('/', (_req: Request, res: Response) => {
  count += 1;
  res.json({ count });
});

export default router;
