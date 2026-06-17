import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { appUsers, AppUser } from '../store';
import { authMiddleware } from '../middleware/auth.middleware';

export const usersRouter = Router();
usersRouter.use(authMiddleware);

usersRouter.get('/', (req: Request, res: Response): void => {
  const { search, role, status, sort, order, page, limit } = req.query as Record<string, string>;

  let filtered = [...appUsers];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  if (role && ['admin', 'editor', 'viewer'].includes(role)) {
    filtered = filtered.filter(u => u.role === role);
  }

  if (status && ['active', 'inactive'].includes(status)) {
    filtered = filtered.filter(u => u.status === status);
  }

  if (sort) {
    const dir = order === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      const aVal = a[sort as keyof AppUser] ?? '';
      const bVal = b[sort as keyof AppUser] ?? '';
      return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
    });
  }

  const pageNum = parseInt(page ?? '1', 10);
  const limitNum = parseInt(limit ?? '10', 10);
  const total = filtered.length;
  const items = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    users: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

usersRouter.get('/:id', (req: Request, res: Response): void => {
  const user = appUsers.find(u => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

usersRouter.post('/', (req: Request, res: Response): void => {
  const { name, email, role, status } = req.body as Partial<AppUser>;

  if (!name || !email || !role) {
    res.status(400).json({ error: 'name, email, and role are required' });
    return;
  }

  if (!['admin', 'editor', 'viewer'].includes(role)) {
    res.status(400).json({ error: 'role must be admin, editor, or viewer' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (appUsers.find(u => u.email === email)) {
    res.status(409).json({ error: 'Email already exists' });
    return;
  }

  const newUser: AppUser = {
    id: uuidv4(),
    name,
    email,
    role,
    status: status ?? 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  appUsers.push(newUser);
  res.status(201).json(newUser);
});

usersRouter.put('/:id', (req: Request, res: Response): void => {
  const idx = appUsers.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updates = req.body as Partial<AppUser>;
  if (updates.role && !['admin', 'editor', 'viewer'].includes(updates.role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  appUsers[idx] = { ...appUsers[idx], ...updates, id: appUsers[idx].id };
  res.json(appUsers[idx]);
});

usersRouter.delete('/:id', (req: Request, res: Response): void => {
  const idx = appUsers.findIndex(u => u.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const deleted = appUsers.splice(idx, 1)[0];
  res.json({ message: 'User deleted', user: deleted });
});
