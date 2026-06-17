import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { loggerMiddleware } from './middleware/logger.middleware';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { metricsRouter } from './routes/metrics';
import { reportsRouter } from './routes/reports';
import { seedData } from './store';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// __dirname is app/api/ when using ts-node, so go one level up for app/
const APP_DIR = path.join(__dirname, '..');
const PORTFOLIO_DIR = path.join(__dirname, '../../portfolio');

app.use(express.static(APP_DIR));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/reports', reportsRouter);

app.get('/', (_req, res) => {
  res.sendFile(path.join(APP_DIR, 'index.html'));
});

app.get('/login', (_req, res) => {
  res.sendFile(path.join(APP_DIR, 'login.html'));
});

app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(APP_DIR, 'dashboard.html'));
});

app.get('/analytics', (_req, res) => {
  res.sendFile(path.join(APP_DIR, 'analytics.html'));
});

app.get('/users', (_req, res) => {
  res.sendFile(path.join(APP_DIR, 'users.html'));
});

app.get('/reports', (_req, res) => {
  res.sendFile(path.join(APP_DIR, 'reports.html'));
});

app.get('/cv', (_req, res) => {
  res.sendFile(path.join(PORTFOLIO_DIR, 'index.html'));
});

seedData();

app.listen(PORT, () => {
  console.log(`Luminary Analytics API running on http://localhost:${PORT}`);
});

export default app;
