import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { regenerateManagedDocs } from '../src/lib/demo-governance.js';

function main() {
  const rootDir = process.env.PLAYBOOK_MANAGED_DOCS_ROOT ? path.resolve(process.env.PLAYBOOK_MANAGED_DOCS_ROOT) : process.cwd();
  regenerateManagedDocs(rootDir);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

export { main };
