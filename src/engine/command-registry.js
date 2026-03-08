import { runAnalyze } from '../commands/analyze.js';
import { runApply } from '../commands/apply.js';
import { runDiagram } from '../commands/diagram.js';
import { runDoctor } from '../commands/doctor.js';
import { runExplain } from '../commands/explain.js';
import { runIndex } from '../commands/index.js';
import { runPlan } from '../commands/plan.js';
import { runRules } from '../commands/rules.js';
import { runVerify } from '../commands/verify.js';

const commandOrder = ['analyze', 'index', 'explain', 'rules', 'verify', 'plan', 'apply', 'diagram', 'doctor'];

const commandMetadata = [
  { command: 'analyze', description: 'Inspect repository profile and deterministic demo shape.' },
  { command: 'index', description: 'Generate deterministic repository intelligence artifacts.' },
  { command: 'explain', description: 'Explain architecture, modules, or rule semantics.' },
  { command: 'rules', description: 'List built-in deterministic rule inventory.' },
  { command: 'verify', description: 'Detect current policy and documentation findings.' },
  { command: 'plan', description: 'Generate deterministic remediation tasks from findings.' },
  { command: 'apply', description: 'Apply approved deterministic remediation actions.' },
  { command: 'diagram', description: 'Render architecture diagrams from indexed modules.' },
  { command: 'doctor', description: 'Print deterministic health guidance for the demo.' }
];

const commandRunners = {
  analyze: (options) => runAnalyze(options),
  index: (options) => runIndex(options),
  explain: (options) => runExplain(options),
  rules: (options) => runRules(options),
  verify: (options) => runVerify(options),
  plan: (options) => runPlan(options),
  apply: (options) => runApply(options),
  diagram: (options) => runDiagram(options),
  doctor: (options) => runDoctor(options)
};

function assertRegistryIntegrity() {
  const metadataCommands = commandMetadata.map((entry) => entry.command).sort();
  const runnerCommands = Object.keys(commandRunners).sort();
  const orderedCommands = [...commandOrder].sort();

  if (JSON.stringify(metadataCommands) !== JSON.stringify(runnerCommands)) {
    throw new Error('Command metadata and command runners are out of sync.');
  }

  if (JSON.stringify(metadataCommands) !== JSON.stringify(orderedCommands)) {
    throw new Error('Command order and command metadata are out of sync.');
  }
}

assertRegistryIntegrity();

export function listCommands() {
  return commandOrder.map((command) => commandMetadata.find((entry) => entry.command === command));
}

export function resolveCommandRunner(command) {
  return commandRunners[command] ?? null;
}
