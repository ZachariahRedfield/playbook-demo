import { chmod, cp, mkdir, rm } from 'node:fs/promises';

const sourceRoot = new URL('../src/', import.meta.url);
const destinationRoot = new URL('../dist/', import.meta.url);

const pathsToCopy = ['cli.js', 'commands', 'engine', 'lib', 'rules'];

await rm(destinationRoot, { recursive: true, force: true });
await mkdir(destinationRoot, { recursive: true });

for (const path of pathsToCopy) {
  await cp(new URL(path, sourceRoot), new URL(path, destinationRoot), {
    recursive: true,
    force: true
  });
}

if (process.platform !== 'win32') {
  try {
    await chmod(new URL('cli.js', destinationRoot), 0o755);
  } catch {
    // Ignore permission/mode issues on platforms that do not support chmod reliably.
  }
}
