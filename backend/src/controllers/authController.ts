import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { signToken } from '../utils/jwt';
import prisma from '../prisma';

// Simple login that creates a user and returns a token (kept for compatibility)
export async function login(req: Request, res: Response) {
  const { phone, name } = req.body as { phone?: string; name?: string };

  if (!phone) return res.status(400).json({ error: 'phone is required' });

  let user = await userService.findUserByPhone(phone);
  if (!user) {
    user = await userService.createUserWithWallet(phone, name);
  }

  const token = signToken({ userId: user.id, role: user.role });

  return res.json({ token, user });
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'unauthorized' });

  const full = await prisma.user.findUnique({ where: { id: user.id } });
  return res.json({ user: full });
}

// ===== OTP endpoints =====
// Dev-only: request OTP (returns OTP in response). Creates an Otp row.
export async function requestOtp(req: Request, res: Response) {
  const { phone } = req.body as { phone?: string };
  if (!phone) return res.status(400).json({ error: 'phone is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const otp = await prisma.otp.create({ data: { phone, code, expiresAt } });

  // In production you'd send via SMS; for dev we return it
  return res.json({ success: true, otp: otp.code });
}

export async function verifyOtp(req: Request, res: Response) {
  const { phone, code } = req.body as { phone?: string; code?: string };
  if (!phone || !code) return res.status(400).json({ error: 'phone and code are required' });

  const otp = await prisma.otp.findFirst({
    where: {
      phone,
      code,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return res.status(400).json({ error: 'invalid or expired code' });

  await prisma.otp.update({ where: { id: otp.id }, data: { used: true } });

  // find or create user
  let user = await userService.findUserByPhone(phone);
  if (!user) user = await userService.createUserWithWallet(phone);

  const token = signToken({ userId: user.id, role: user.role });

  return res.json({ token, user });
}
