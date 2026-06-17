import { Router, Request, Response } from 'express';
import { metricDays } from '../store';
import { authMiddleware } from '../middleware/auth.middleware';

export const metricsRouter = Router();
metricsRouter.use(authMiddleware);

metricsRouter.get('/', (_req: Request, res: Response): void => {
  const last30 = metricDays.slice(-30);
  const prev30 = metricDays.slice(-60, -30);

  const sum = (arr: typeof metricDays, key: keyof typeof metricDays[0]) =>
    arr.reduce((acc, d) => acc + (d[key] as number), 0);

  const pctChange = (cur: number, prev: number): number =>
    prev === 0 ? 0 : Math.round(((cur - prev) / prev) * 100 * 10) / 10;

  const curRevenue = sum(last30, 'revenue');
  const prevRevenue = sum(prev30, 'revenue');
  const curUsers = sum(last30, 'users');
  const prevUsers = sum(prev30, 'users');
  const curSessions = sum(last30, 'sessions');
  const prevSessions = sum(prev30, 'sessions');
  const curConversions = sum(last30, 'conversions');
  const prevConversions = sum(prev30, 'conversions');
  const curConvRate = curSessions === 0 ? 0 : curConversions / curSessions;
  const prevConvRate = prevSessions === 0 ? 0 : prevConversions / prevSessions;

  const cards = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: `$${(curRevenue / 1000).toFixed(1)}k`,
      rawValue: curRevenue,
      change: pctChange(curRevenue, prevRevenue),
      trend: curRevenue >= prevRevenue ? 'up' : 'down',
    },
    {
      id: 'active-users',
      label: 'Active Users',
      value: curUsers.toLocaleString(),
      rawValue: curUsers,
      change: pctChange(curUsers, prevUsers),
      trend: curUsers >= prevUsers ? 'up' : 'down',
    },
    {
      id: 'conversion-rate',
      label: 'Conversion Rate',
      value: `${(curConvRate * 100).toFixed(1)}%`,
      rawValue: curConvRate,
      change: pctChange(curConvRate, prevConvRate),
      trend: curConvRate >= prevConvRate ? 'up' : 'down',
    },
    {
      id: 'avg-session',
      label: 'Avg Session Time',
      value: '3m 42s',
      rawValue: 222,
      change: 4.2,
      trend: 'up',
    },
  ];

  const series = last30.map(d => ({
    date: d.date,
    sessions: d.sessions,
    revenue: d.revenue,
    users: d.users,
    conversions: d.conversions,
  }));

  const trafficSources = [
    { label: 'Organic Search', value: 38 },
    { label: 'Direct', value: 24 },
    { label: 'Social Media', value: 20 },
    { label: 'Referral', value: 12 },
    { label: 'Email', value: 6 },
  ];

  const topPages = [
    { path: '/dashboard', sessions: 8420, bounceRate: 18.3, avgTime: '4m 12s' },
    { path: '/analytics', sessions: 5218, bounceRate: 22.1, avgTime: '3m 44s' },
    { path: '/users', sessions: 3912, bounceRate: 15.8, avgTime: '5m 01s' },
    { path: '/reports', sessions: 2876, bounceRate: 28.4, avgTime: '2m 33s' },
    { path: '/login', sessions: 2241, bounceRate: 42.0, avgTime: '0m 58s' },
  ];

  res.json({ cards, series, trafficSources, topPages });
});
