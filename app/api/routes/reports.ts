import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { reports, Report } from '../store';
import { authMiddleware } from '../middleware/auth.middleware';

export const reportsRouter = Router();
reportsRouter.use(authMiddleware);

reportsRouter.get('/', (_req: Request, res: Response): void => {
  res.json({ reports });
});

reportsRouter.get('/:id', (req: Request, res: Response): void => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  res.json(report);
});

reportsRouter.post('/generate', (req: Request, res: Response): void => {
  const { name, type } = req.body as Partial<Report>;
  if (!name || !type) {
    res.status(400).json({ error: 'name and type are required' });
    return;
  }

  const report: Report = {
    id: uuidv4(),
    name,
    type,
    createdAt: new Date().toISOString(),
    status: 'ready',
    rows: Math.floor(Math.random() * 1000) + 100,
  };

  reports.push(report);
  res.status(201).json(report);
});

reportsRouter.get('/:id/download', (req: Request, res: Response): void => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }

  const csvLines = [
    'Date,Metric,Value',
    ...Array.from({ length: Math.min(report.rows, 10) }, (_, i) => {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      return `${date},${report.type},${Math.floor(Math.random() * 1000)}`;
    }),
  ];

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${report.name.replace(/\s/g, '-')}.csv"`);
  res.send(csvLines.join('\n'));
});

reportsRouter.delete('/:id', (req: Request, res: Response): void => {
  const idx = reports.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  const deleted = reports.splice(idx, 1)[0];
  res.json({ message: 'Report deleted', report: deleted });
});
