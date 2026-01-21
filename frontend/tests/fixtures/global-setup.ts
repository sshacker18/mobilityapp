import fs from 'fs';
import path from 'path';
import type { FullConfig } from '@playwright/test';
import { startServers } from './startServers';

/**
 * Playwright globalSetup. Optionally starts local servers when PW_LOCAL_SERVERS=1.
 * Writes a small JSON file with server info that tests can read.
 */
export default async function globalSetup(config: FullConfig) {
  const outFile = path.join(config.rootDir, 'tests', 'fixtures', 'pw-servers.json');

  if (process.env.PW_LOCAL_SERVERS === '1') {
    console.log('PW: starting local frontend and backend servers...');
    const started = await startServers();

    const payload = {
      frontendUrl: started.frontendUrl,
      backendUrl: started.backendUrl,
      pids: started.pids,
      startedAt: new Date().toISOString(),
    };

    try {
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
      // ensure we kill processes when the node process exits
      process.on('exit', () => {
        // best-effort
        started.kill().catch(() => {});
      });
    } catch (e) {
      console.warn('PW: could not write server file', e);
    }

    console.log('PW: servers started and info written to', outFile);
  } else {
    // No-op: tests are expected to use existing servers; tests should read PLAYWRIGHT_BASE_URL or pw-servers.json
    console.log('PW: PW_LOCAL_SERVERS not set; assuming servers are started externally.');
  }
}
