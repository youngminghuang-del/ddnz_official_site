import { cp, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditDeploymentFiles } from './audit-deployment-files.mjs';

// Documents can be cloud-synced on macOS. Keep the reviewed preview outside
// that folder so delayed conflict copies cannot enter a running preview.
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const source = await auditDeploymentFiles({ projectRoot });
if (!source.ok) throw new Error('Preview staging refused: run the build and resolve its deployment inventory failures first.');

const previewRoot = await mkdtemp(path.join(os.tmpdir(), 'ddnz-preview-'));
const distDir = path.join(previewRoot, 'dist');
await cp(path.join(projectRoot, 'dist'), distDir, { recursive: true, errorOnExist: true, force: false });
const staged = await auditDeploymentFiles({ projectRoot, distDir });
if (!staged.ok) throw new Error(`Preview staging failed its inventory audit: ${JSON.stringify(staged.issues)}`);
const manifest = {
  mode: 'local-preview-only',
  createdAt: new Date().toISOString(),
  projectRoot,
  distDir,
  ...staged.summary,
};
await writeFile(path.join(previewRoot, 'preview-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
