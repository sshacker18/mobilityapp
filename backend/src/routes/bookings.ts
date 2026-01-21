import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder bookings router — returns 501 for all endpoints until implemented.
router.use((req: Request, res: Response) => {
  res.status(501).json({ message: 'Booking routes not implemented yet' });
});

export default router;
