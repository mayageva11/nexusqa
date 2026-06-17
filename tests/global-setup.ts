import { request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3001';
const AUTH_STATE_DIR = path.join(__dirname, 'auth-state');

async function globalSetup(): Promise<void> {
  if (!fs.existsSync(AUTH_STATE_DIR)) {
    fs.mkdirSync(AUTH_STATE_DIR, { recursive: true });
  }

  const apiContext = await request.newContext({ baseURL: BASE_URL });

  await apiContext.get('/health').catch(() => {
    throw new Error(`App server not reachable at ${BASE_URL}. Start it with: make app`);
  });

  const credentials = [
    { email: 'admin@luminary.io', file: 'admin.auth.json' },
    { email: 'editor@luminary.io', file: 'editor.auth.json' },
    { email: 'viewer@luminary.io', file: 'viewer.auth.json' },
  ];

  for (const cred of credentials) {
    const res = await apiContext.post('/api/auth/login', {
      data: { email: cred.email, password: 'Test1234!' },
    });

    if (!res.ok()) {
      throw new Error(`Failed to authenticate ${cred.email}: ${res.status()}`);
    }

    const { token, user } = await res.json() as { token: string; user: Record<string, unknown> };
    const storageState = {
      cookies: [],
      origins: [
        {
          origin: BASE_URL,
          localStorage: [
            { name: 'luminary_token', value: token },
            { name: 'luminary_user', value: JSON.stringify(user) },
          ],
        },
      ],
    };
    fs.writeFileSync(
      path.join(AUTH_STATE_DIR, cred.file),
      JSON.stringify(storageState, null, 2)
    );
  }

  await apiContext.dispose();
  console.log('Global setup complete — auth states saved');
}

export default globalSetup;
