import { Router, Request, Response } from 'express';

const router = Router();

// Admin placeholder router: all endpoints return 501 until implemented.
router.use((req: Request, res: Response) => {
  res.status(501).json({ message: 'Admin routes not implemented yet' });
});

export default router;
