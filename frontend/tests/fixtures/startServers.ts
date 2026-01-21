import { execa } from 'execa';
import waitOn from 'wait-on';
import path from 'path';
import fs from 'fs';

type Started = {
  kill: () => Promise<void>;
  frontendUrl: string;
  backendUrl: string;
  pids: number[];
};

/**
 * Starts frontend and backend dev servers (optional). Returns kill function and info.
 * Adjust commands or cwd if your project uses different scripts/ports.
 */
export async function startServers(): Promise<Started> {
  const repoRoot = path.resolve(__dirname, '../../../');
  const backendPath = path.join(repoRoot, 'backend');
  const frontendPath = path.join(repoRoot, 'frontend');

  // Default URLs used for health checks; update if your apps use different ports
  const backendUrl = process.env.TEST_BACKEND_URL || 'http://localhost:4000';
  const frontendUrl = process.env.TEST_FRONTEND_URL || 'http://localhost:5173';

  const backendHealth = `${backendUrl}/api/health`;
  const frontendHealth = frontendUrl;

  // Spawn backend and frontend via `npm run dev`
  const backend = execa('npm', ['run', 'dev'], { cwd: backendPath, env: { ...process.env } });
  const frontend = execa('npm', ['run', 'dev'], { cwd: frontendPath, env: { ...process.env } });

  // Pipe child output to disk for debugging (optional)
  const outDir = path.join(frontendPath, 'tests', 'fixtures', 'logs');
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch (e) {
    // ignore
  }

  backend.stdout?.pipe(fs.createWriteStream(path.join(outDir, 'backend.log')));
  backend.stderr?.pipe(fs.createWriteStream(path.join(outDir, 'backend.err.log')));
  frontend.stdout?.pipe(fs.createWriteStream(path.join(outDir, 'frontend.log')));
  frontend.stderr?.pipe(fs.createWriteStream(path.join(outDir, 'frontend.err.log')));

  // Wait for services to be available
  try {
    await waitOn({ resources: [backendHealth, frontendHealth], timeout: 60_000 });
  } catch (err) {
    // If wait-on failed, kill spawned processes and rethrow
    try { backend.kill(); } catch (e) {}
    try { frontend.kill(); } catch (e) {}
    throw new Error(`Timed out waiting for servers. backend: ${backendHealth}, frontend: ${frontendHealth}`);
  }

  const pids: number[] = [];
  if (backend.pid) pids.push(backend.pid);
  if (frontend.pid) pids.push(frontend.pid);

  const kill = async () => {
    try { backend.kill(); } catch (e) {}
    try { frontend.kill(); } catch (e) {}
  };

  return { kill, frontendUrl, backendUrl, pids };
}
