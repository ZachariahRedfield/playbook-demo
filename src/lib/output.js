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

export function printUsage(commands = []) {
  console.log('Usage: playbook <command> [options]');

  if (commands.length === 0) {
    return;
  }

  console.log('\nCommands (deterministic order):');
  commands.forEach((entry) => {
    console.log(`- ${entry.command.padEnd(7)} ${entry.description}`);
  });
}
