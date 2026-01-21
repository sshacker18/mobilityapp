import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../prisma';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });

  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'invalid token' });

  try {
    const user = await prisma.user.findUnique({ where: { id: (payload as any).userId } });
    if (!user) return res.status(401).json({ error: 'invalid token user' });

    (req as any).user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}
