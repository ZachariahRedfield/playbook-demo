import { listDirectories } from '../lib/files.js';

export function runDiagram() {
  const features = listDirectories('src/features');

  console.log('Playbook Architecture Diagram\n');
  console.log('src');
  console.log('└── features');

  if (features.length === 0) {
    console.log('    └── (none detected)');
    return;
  }

  features.forEach((feature, index) => {
    const branch = index === features.length - 1 ? '└──' : '├──';
    console.log(`    ${branch} ${feature}`);
  });
}
