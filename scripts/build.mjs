import { chmod, copyFile, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';

const source = new URL('../src/cli.js', import.meta.url);
const destinationDir = new URL('../dist/', import.meta.url);
const destination = new URL('./cli.js', destinationDir);

await mkdir(destinationDir, { recursive: true });
await copyFile(source, destination, constants.COPYFILE_FICLONE);

if (process.platform !== 'win32') {
  try {
    await chmod(destination, 0o755);
  } catch {
    // Ignore permission/mode issues on platforms that do not support chmod reliably.
  }
}
