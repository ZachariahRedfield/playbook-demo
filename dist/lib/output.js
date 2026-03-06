export function printNextSteps(steps) {
  console.log('\nNext steps');
  console.log('────────────────');
  console.log('');

  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step.title}`);
    console.log(`   ${step.command}`);
    console.log('');
  });
}

export function printUsage() {
  console.log('Usage: playbook <status|analyze|explain|fix|verify>');
}
