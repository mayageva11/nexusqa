import { v4 as uuidv4 } from 'uuid';

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface MetricDay {
  date: string;
  sessions: number;
  revenue: number;
  users: number;
  conversions: number;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: 'ready' | 'processing';
  rows: number;
}

export interface InvalidatedToken {
  token: string;
  invalidatedAt: string;
}

export const authUsers: AuthUser[] = [];
export const appUsers: AppUser[] = [];
export const metricDays: MetricDay[] = [];
export const reports: Report[] = [];
export const invalidatedTokens: Set<string> = new Set();

export function seedData(): void {
  authUsers.push(
    { id: uuidv4(), email: 'admin@luminary.io', password: 'Test1234!', name: 'Admin User', role: 'admin', avatar: 'AU' },
    { id: uuidv4(), email: 'editor@luminary.io', password: 'Test1234!', name: 'Editor User', role: 'editor', avatar: 'EU' },
    { id: uuidv4(), email: 'viewer@luminary.io', password: 'Test1234!', name: 'Viewer User', role: 'viewer', avatar: 'VU' }
  );

  const roles: Array<'admin' | 'editor' | 'viewer'> = ['admin', 'editor', 'viewer'];
  const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Karen', 'Leo', 'Mia', 'Noah', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White'];

  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const daysAgo = Math.floor(Math.random() * 30);
    const lastLogin = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const createdAt = new Date(Date.now() - (daysAgo + 30) * 86400000).toISOString();
    appUsers.push({
      id: uuidv4(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@luminary.io`,
      role: roles[i % 3],
      status: i % 5 === 0 ? 'inactive' : 'active',
      lastLogin,
      createdAt,
    });
  }

  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    metricDays.push({
      date: date.toISOString().split('T')[0],
      sessions: 800 + Math.floor(Math.random() * 400),
      revenue: 4000 + Math.floor(Math.random() * 2000),
      users: 200 + Math.floor(Math.random() * 100),
      conversions: 40 + Math.floor(Math.random() * 30),
    });
  }

  const reportTypes = ['Traffic Overview', 'Revenue Summary', 'User Acquisition', 'Conversion Funnel', 'Retention Analysis'];
  reportTypes.forEach((name, i) => {
    reports.push({
      id: uuidv4(),
      name,
      type: ['traffic', 'revenue', 'acquisition', 'conversion', 'retention'][i],
      createdAt: new Date(Date.now() - (i + 1) * 7 * 86400000).toISOString(),
      status: 'ready',
      rows: 500 + i * 100,
    });
  });
}

export function resetData(): void {
  authUsers.length = 0;
  appUsers.length = 0;
  metricDays.length = 0;
  reports.length = 0;
  invalidatedTokens.clear();
  seedData();
}
