import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authUsers, invalidatedTokens } from '../store';
import { authMiddleware } from '../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (typeof email !== 'string' || email.length > 254) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  const user = authUsers.find(u => u.email === email);
  if (!user || user.password !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const secret = process.env.JWT_SECRET ?? 'dev-secret';
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

authRouter.post('/logout', authMiddleware, (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    invalidatedTokens.add(token);
  }
  res.json({ message: 'Logged out successfully' });
});

authRouter.get('/me', authMiddleware, (req: Request, res: Response): void => {
  const user = authUsers.find(u => u.id === req.user?.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  });
});
