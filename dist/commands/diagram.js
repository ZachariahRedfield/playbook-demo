import path from 'node:path';
import { listDirectories, writeFile } from '../lib/files.js';

function generateDiagram(repo = '.') {
  const featuresPath = path.join(repo, 'src/features');
  const features = listDirectories(featuresPath);

  const lines = ['# Architecture Diagrams', '', '```text', 'src', '└── features'];

  if (features.length === 0) {
    lines.push('    └── (none detected)');
  } else {
    features.forEach((feature, index) => {
      const branch = index === features.length - 1 ? '└──' : '├──';
      lines.push(`    ${branch} ${feature}`);
    });
  }

  lines.push('```', '');
  return { features, markdown: lines.join('\n') };
}

export function runDiagram({ repo = '.', out, json = false } = {}) {
  const diagram = generateDiagram(repo);

  if (out) {
    writeFile(out, diagram.markdown);
  }

  if (json) {
    console.log(JSON.stringify({ repo, out: out ?? null, features: diagram.features }, null, 2));
    return;
  }

  if (out) {
    console.log(`Wrote diagram to ${out}`);
    return;
  }

  console.log('Playbook Architecture Diagram\n');
  console.log('src');
  console.log('└── features');

  if (diagram.features.length === 0) {
    console.log('    └── (none detected)');
    return;
  }

  diagram.features.forEach((feature, index) => {
    const branch = index === diagram.features.length - 1 ? '└──' : '├──';
    console.log(`    ${branch} ${feature}`);
  });
}
