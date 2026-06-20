import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { invalidatedTokens } from '../store';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  jti: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  if (invalidatedTokens.has(token)) {
    res.status(403).json({ error: 'Token has been invalidated' });
    return;
  }

  const secret = process.env.JWT_SECRET ?? 'dev-secret';
  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}
