import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(): Promise<void> {
  const authStateDir = path.join(__dirname, 'auth-state');
  if (fs.existsSync(authStateDir)) {
    fs.rmSync(authStateDir, { recursive: true, force: true });
  }
  console.log('Global teardown complete — auth states cleaned up');
}

export default globalTeardown;
