import fs from 'node:fs';
import path from 'node:path';

export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function writeFile(filePath, contents) {
  fs.writeFileSync(filePath, contents);
}

export function pathExists(filePath) {
  return fs.existsSync(filePath);
}

export function listDirectories(rootPath) {
  if (!pathExists(rootPath)) {
    return [];
  }

  return fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function listMarkdownBasenames(rootPath) {
  if (!pathExists(rootPath)) {
    return [];
  }

  return fs
    .readdirSync(rootPath)
    .filter((name) => path.extname(name).toLowerCase() === '.md')
    .map((name) => path.basename(name, '.md'))
    .sort();
}
