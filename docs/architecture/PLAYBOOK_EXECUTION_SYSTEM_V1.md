# Playbook Deterministic Development Execution System (v1)

This document converts the current audit baseline into a concrete operating model and an implementation roadmap for a 4-week sprint.

## 1. Executive Decisions

1. **Canonical command implementation is engine-owned.**
   - `packages/cli` is a transport + UX shell only.
   - Command behavior is not authored in CLI wrappers.
2. **`analyze` remains first-class and stable**, but becomes a composition command that orchestrates intelligence primitives (`index`/`graph`/`query`) via engine contracts.
3. **`graph` remains standalone** and evolves into the Architecture Intelligence Graph surface with subcommands (`graph build|diff|impact|boundaries`).
4. **`verify` becomes the deterministic policy gate** for contracts/docs/tests/roadmap integrity; it is the integration point between governance and intelligence.
5. **One plugin registry in engine** with typed command metadata, capability tags, and lifecycle hooks.
6. **SCM context normalization ships before diff-heavy features**, and is a hard dependency for `analyze-pr`, `ask --diff-context`, and diff-aware `verify` checks.
7. **Roadmap is contract-driven work inventory.** No feature ships without a `feature_id`, contract references, and verification commands.
8. **Failure Intelligence Loop and Architecture Intelligence Graph are roadmap features, not side practices.**

## 2. Canonical Command Model

| Command | Purpose | Canonical owner | Lifecycle | De-duplication strategy |
| --- | --- | --- | --- | --- |
| `analyze` | High-level repo health + architecture + governance synthesis. | `@zachariahredfield/playbook-engine` | stable | Composition over `index`, `graph`, `query`, policy checks; no unique parsers in CLI. |
| `verify` | Deterministic policy enforcement gate for roadmap/contracts/docs/tests/boundaries. | engine | stable | Becomes single “quality gate” command; remove overlapping ad-hoc checks elsewhere. |
| `plan` | Deterministic remediation/action plan from verify/analyze findings. | engine | stable | Inputs are normalized findings schema only. |
| `apply` | Safe, policy-aware remediation execution. | engine | stable | Consumes `plan` contract only; no direct bespoke fix paths. |
| `index` | Build/update repository symbol + file inventory artifacts. | engine | stable | Sole source for structural inventory. |
| `graph` | Build/query semantic architecture graph + impact graph. | engine | stable (expanded) | Existing graph command evolves into Architecture Intelligence Graph facade. |
| `query` | Deterministic graph/index query surface for scripts and agents. | engine | stable | Canonical machine query API; `ask`/`explain` call this internally. |
| `ask` | User-facing NL intent mapping to deterministic query plans. | engine | compatibility -> stable after AIG | Keep ergonomic UX, but route through `query` plans. |
| `explain` | Narrative architectural explanation grounded in artifacts/contracts. | engine | stable | Presentation layer over `query` + `graph` evidence. |
| `analyze-pr` | PR-scoped risk/boundary/impact analysis from normalized SCM context + graph. | engine | stable (after SCM) | Depends on shared SCM normalization + AIG, no duplicate diff logic. |

Decision: **Model A and Model B are unified as one command stack:**
- **Foundation layer:** `index`, `graph`, `query`
- **Reasoning/UX layer:** `ask`, `explain`, `analyze-pr`
- **Governance execution layer:** `analyze`, `verify`, `plan`, `apply`

## 3. Package Boundary and Plugin Convergence Plan

### Target boundary model
- `packages/core`
  - Contracts, schemas, shared types, result envelopes, error taxonomy, policy primitives.
- `packages/engine`
  - Command handlers, orchestration pipelines, plugin registry, SCM normalization, graph/index services.
- `packages/node`
  - Node runtime adapters: filesystem, git process exec, caching, path resolution, environment bindings.
- `packages/cli`
  - Argument parsing, terminal rendering, command dispatch to engine registry.

### Plugin registry shape
- One registry in engine (`registerCommand`, `registerCapability`, `resolveCommand`).
- Metadata per command: `name`, `ownerPackage`, `status`, `capabilities`, `inputSchema`, `outputSchema`, `verificationHooks`.
- Capability tags: `governance`, `intelligence`, `scm-aware`, `artifact-writer`, `advisory-only`.

### Migration sequence
1. Freeze command ownership map in docs/contracts.
2. Migrate command registration into single engine registry.
3. Convert CLI command handlers to thin invoke wrappers.
4. Move duplicated analyze and verify helper logic out of CLI into engine services.
5. Add registry integrity CI check (ownership, status, missing schemas).

### Anti-patterns to eliminate
- Command logic in CLI files.
- Multiple command inventories across packages.
- JSON output shapes authored inline without contract references.
- Plugin loading side effects at import time.

## 4. Shared SCM Context Normalization System

### Ownership
- Engine module: `packages/engine/src/scm/context.ts` (or `.js`) with node adapters from `packages/node`.

### API shape
- `getScmContext(options): ScmContext`
- `getDiffContext(options): DiffContext`
- `resolveMergeBase(baseRef?, headRef?): MergeBaseResult`
- `normalizeChangedFiles(rawDiff): NormalizedFileChange[]`

### Normalization strategy
- Normalize refs (`HEAD`, base branch, detached heads).
- Normalize change types (`added`, `modified`, `deleted`, `renamed`, `copied`, `mode_changed`, `binary`).
- Normalize path casing/slashes and rename pairs.
- Include shallow clone confidence flags.
- Include deterministic fallback modes (e.g., working tree diff only).

### Contract test matrix (must pass)
- detached HEAD
- shallow clone with missing merge-base
- rename-heavy diff
- deleted-file-only PR
- binary file changes
- submodule pointer changes
- untracked + staged mixed state

### Migration order
1. `analyze-pr`
2. `ask --diff-context`
3. diff-aware `verify` checks
4. any remaining custom git readers

### Unblocking impact
- `analyze-pr` gets stable base/head semantics and deterministic changed-file sets.
- `ask --diff-context` and risk analysis stop depending on ad-hoc git command output.
- `verify` can enforce boundary and risk gates with consistent SCM inputs.

## 5. Roadmap Execution System

### Machine-readable roadmap schema
Required fields per feature:
- `feature_id`, `version`, `title`, `goal`, `commands`, `contracts`, `tests`, `docs`, `dependencies`, `package_ownership`, `verification_commands`, `status`

### docs/roadmap structure
- `docs/roadmap/ROADMAP.json` (source of truth)
- `docs/roadmap/README.md` (workflow + status definitions + gate policy)

### Verification command
- `playbook roadmap verify` delegates to roadmap validator script.
- CI command: `node scripts/validate-roadmap.mjs`

### PR and commit enforcement
- PR template requires `Roadmap-ID: PB-...`.
- Commit/PR validation script checks referenced IDs exist in `ROADMAP.json`.

### Automatic status transitions
- `planned` -> `in_progress` when PR referencing ID is opened.
- `in_progress` -> `completed` when merge includes all verification commands and contract refs.
- Auto-update script writes status delta and changelog notes.

### Release hooks
- Generate release notes grouped by roadmap IDs and commands impacted.

## 6. Contract / Docs / Tests Enforcement Model

### Blocking checks
- Missing or invalid roadmap ID for feature PRs.
- Command output contract change without contract doc update.
- Contract change without at least one matching test/snapshot update.
- Registry ownership drift (command owner mismatch).
- SCM normalization contract failures for diff-aware commands.

### Warning-only checks during sprint (low-noise)
- Non-critical docs style drift.
- Optional architecture narrative docs lag (if contracts/tests are aligned).
- Advisory governance notes and heuristics.

### Contract change checklist (required)
1. Update command contract spec.
2. Update JSON schema/snapshot fixtures.
3. Update/extend deterministic tests.
4. Update command docs (`docs/commands/README.md` or command-specific docs).
5. Reference roadmap ID in PR.
6. Run verification command list and include outputs.

### Docs generation policy
- Generated: command reference tables, schema references, roadmap status tables.
- Hand-authored: architecture rationale, migration narrative, governance policies.

## 7. Failure Intelligence Loop Roadmap Feature

- **Version:** `v0.6`
- **Feature ID:** `PB-V06-FAILURE-INTELLIGENCE-001`
- **Goal:** Convert recurring failures into durable prevention assets (rules/tests/docs/checks).
- **Command surface:**
  - `playbook failures ingest`
  - `playbook failures classify`
  - `playbook failures prevent`
  - `playbook failures scaffold` (v0.6 optional, full in v0.6.x)
- **Package ownership:**
  - engine (classification + mapping pipeline)
  - core (taxonomy schema + prevention contracts)
  - cli (rendering/UX)
- **Contracts:** failure event schema, taxonomy schema, prevention mapping schema.
- **Tests:** ingestion determinism tests, taxonomy classification fixtures, scaffold generation snapshots.
- **Docs:** `docs/failures/README.md`, contracts appendix, workflow integration docs.
- **Verification commands:**
  - `playbook failures ingest --json`
  - `playbook failures classify --json`
  - `playbook failures prevent --json`

### Example taxonomy
- `category`: `contract_drift | boundary_violation | scm_context | docs_sync | flaky_test | dependency_risk`
- `severity`: `low | medium | high | critical`
- `scope`: `command | package | workflow | release`
- `root_cause_class`: deterministic enum

### Prevention-target mapping model
- `failure_class -> target_type[]`
  - `contract_drift -> [contract_doc, schema_fixture, snapshot_test, verify_gate]`
  - `boundary_violation -> [boundary_rule, dependency_test, architecture_note]`
  - `scm_context -> [scm_contract_test, diff_parser_guard]`

### Generated output types
- rule suggestions
- test scaffold specs
- docs patch suggestions
- verify gate policy updates

**Prevention of failure mode “Fixes that never become system rules”:**
- Every ingested high/critical failure must produce at least one mapped prevention target artifact before closure.

## 8. Architecture Intelligence Graph Roadmap Feature

- **Version:** `v0.7`
- **Feature ID:** `PB-V07-ARCH-INTELLIGENCE-GRAPH-001`
- **Goal:** Evolve repo graph into semantic architecture graph powering impact/risk reasoning.
- **Relationship to existing artifacts:**
  - Extends `.playbook/repo-index.json` and `.playbook/repo-graph.json`.
  - Adds `.playbook/architecture-graph.json` and `.playbook/impact-cache.json`.
- **Command surface:**
  - `graph build`
  - `graph diff --base --head`
  - `graph impact --target`
  - `graph boundaries --changed`
  - `query`, `explain`, and `analyze-pr` consume this graph.
- **Package ownership:** engine (graph build/query), core (graph schema), node (parser adapters), cli (UX).
- **Contracts:** architecture node/edge schema, impact query contract, boundary-touch contract.
- **Tests:** deterministic graph snapshots, incremental update tests, PR impact fixture tests.
- **Docs:** `docs/architecture/ARCH_INTELLIGENCE_GRAPH.md`, command docs, contract docs.
- **Verification commands:**
  - `playbook graph build --json`
  - `playbook graph impact --target <symbol> --json`
  - `playbook analyze-pr --json`

### Storage/update strategy
- Full build for cold start.
- Incremental update by changed files + dependency closure.
- Persist graph version and source index version hashes.

### Self-analysis usage
- Playbook runs architecture graph on itself for boundary risk checks and roadmap dependency validation.

## 9. Gate Strategy for the 4-Week Sprint

| Gate | Week 0-1 | Week 2-4 |
| --- | --- | --- |
| Roadmap validation | hard-fail | hard-fail |
| Docs audit | warning | hard-fail for command/contract docs |
| Contract changes | hard-fail | hard-fail |
| Snapshot changes | warning (requires explicit reviewer ack) | hard-fail for core command contracts |
| Plugin registry checks | hard-fail | hard-fail |
| SCM normalization checks | hard-fail for diff-aware commands | hard-fail |
| Governance notes | warning | warning |
| Architecture boundary checks | warning (baseline) | hard-fail on touched boundaries |

## 10. 4-Week Implementation Sequence

### Week 0 / pre-sprint stabilization
- Freeze command ownership map and roadmap schema upgrade.
- Add CI checks for `package_ownership` and Roadmap-ID presence.
- Exit criteria: roadmap validator green, PR template updated, no duplicate registry definitions.

### Week 1
- Plugin/command registry convergence and thin CLI migration.
- Deliver initial boundary assertions.
- Exit criteria: all core commands dispatched through engine registry.

### Week 2
- Shared SCM normalization module and diff-aware command migrations.
- Stabilize `analyze-pr` contract and fixtures.
- Exit criteria: SCM test matrix passes; analyze-pr deterministic on fixtures.

### Week 3
- Contract/docs/tests synchronized enforcement for core commands.
- Land failure intelligence ingestion/classification MVP.
- Exit criteria: contract checklist automated; failures pipeline outputs prevention targets.

### Week 4
- Architecture Intelligence Graph MVP + integration with query/explain/analyze-pr/plan.
- Governance gate tuning (noise reduction) and release notes pipeline.
- Exit criteria: impact/boundary queries stable; sprint hard-fail/warning matrix active.

## 11. First 5 Foundational PRs

1. **PR:** `PB-V05: Converge command registry and thin CLI dispatch`
   - Roadmap ID: `PB-V05-PACKAGE-BOUNDARIES-001`
   - Objective: single engine registry ownership
   - Touches: `packages/cli`, `packages/engine`, contracts docs
   - Risk: medium

2. **PR:** `PB-V1: Roadmap schema v1.1 and validation hardening`
   - Roadmap ID: `PB-V1-DELIVERY-SYSTEM-001`
   - Objective: enforce required roadmap fields + PR ID checks
   - Touches: `docs/roadmap/ROADMAP.json`, `scripts/validate-roadmap.mjs`, CI
   - Risk: low

3. **PR:** `PB-V04: Shared SCM context normalization foundation`
   - Roadmap ID: `PB-V04-ANALYZEPR-001`
   - Objective: deterministic SCM context module + contract matrix
   - Touches: `packages/engine`, `packages/node`, tests fixtures
   - Risk: high

4. **PR:** `PB-V06: Failure intelligence loop MVP (ingest/classify/prevent)`
   - Roadmap ID: `PB-V06-FAILURE-INTELLIGENCE-001`
   - Objective: failure taxonomy + prevention mapping outputs
   - Touches: engine/core/cli docs/tests
   - Risk: medium

5. **PR:** `PB-V07: Architecture Intelligence Graph MVP`
   - Roadmap ID: `PB-V07-ARCH-INTELLIGENCE-GRAPH-001`
   - Objective: semantic graph artifacts and impact query path
   - Touches: graph services, query/explain/analyze-pr integration, contracts
   - Risk: high

## 12. Example Artifacts

### Roadmap JSON entry (example)

```json
{
  "feature_id": "PB-V06-FAILURE-INTELLIGENCE-001",
  "version": "v0.6",
  "title": "Failure intelligence loop MVP",
  "goal": "Convert recurring failures into rules/tests/docs/checks.",
  "commands": ["failures ingest", "failures classify", "failures prevent"],
  "contracts": [
    "docs/contracts/COMMAND_CONTRACTS_V1.md#failure-intelligence-contract"
  ],
  "tests": ["tests/failure-intelligence.test.js"],
  "docs": ["docs/failures/README.md"],
  "dependencies": ["PB-V05-PACKAGE-BOUNDARIES-001", "PB-V04-ANALYZEPR-001"],
  "package_ownership": {
    "engine": ["classification", "prevention-mapper"],
    "core": ["taxonomy-schema"],
    "cli": ["rendering"]
  },
  "verification_commands": ["node dist/cli.js failures classify --json"],
  "status": "planned"
}
```

### PR template snippet

```md
## Delivery Linkage
Roadmap-ID: PB-VXX-XXXX-001

## Contract Impact
- [ ] JSON output contract changed
- [ ] Contract docs updated
- [ ] Tests/snapshots updated
```

### Command ownership map (example)

| Command | Owner | Contract |
| --- | --- | --- |
| analyze | engine | analyze contract |
| verify | engine | verify contract |
| graph | engine | graph contract |
| query | engine | query contract |

### Plugin registry interface sketch

```ts
interface CommandPlugin {
  name: string;
  ownerPackage: 'core' | 'engine' | 'node' | 'cli';
  status: 'stable' | 'compatibility' | 'internal' | 'future';
  capabilities: string[];
  inputSchemaRef?: string;
  outputSchemaRef?: string;
  run(ctx: CommandContext): Promise<CommandResult>;
}
```

### SCM context interface sketch

```ts
interface ScmContext {
  repoRoot: string;
  headRef: string;
  baseRef?: string;
  mergeBase?: string;
  detachedHead: boolean;
  shallowClone: boolean;
  confidence: 'high' | 'degraded';
  changedFiles: NormalizedFileChange[];
}
```

### Failure taxonomy schema sketch

```json
{
  "id": "FAIL-2025-001",
  "category": "contract_drift",
  "severity": "high",
  "root_cause_class": "missing_contract_update",
  "prevention_targets": ["contract_doc", "snapshot_test", "verify_gate"]
}
```

### Architecture graph artifact schema sketch

```json
{
  "schemaVersion": "1.0",
  "nodes": [{"id": "pkg:engine", "kind": "module", "role": "orchestration"}],
  "edges": [{"from": "pkg:cli", "to": "pkg:engine", "kind": "depends_on"}],
  "impacts": [{"source": "file:src/engine/graph.js", "affects": ["command:analyze-pr"]}]
}
```

## 13. Codex-Ready Implementation Prompts

### Prompt Cluster 1: Command registry + boundary convergence
- **Objective:** Converge all command ownership into engine registry and keep CLI thin.
- **Plan:** add/extend engine registry, migrate CLI dispatch, add registry integrity test, update command ownership docs.
- **Files:** `packages/engine/*`, `packages/cli/*`, `docs/contracts/COMMAND_CONTRACTS_V1.md`, `docs/commands/README.md`.
- **Verification:** `npm test`, `node dist/cli.js analyze --json`, `node scripts/validate-roadmap.mjs`.
- **Docs summary:** document canonical ownership, command statuses, and migration notes.

### Prompt Cluster 2: SCM normalization foundation
- **Objective:** Introduce deterministic SCM context APIs for all diff-aware commands.
- **Plan:** implement context module, create fixture matrix, migrate `analyze-pr` then `ask --diff-context`.
- **Files:** `packages/engine/src/scm/*`, `packages/node/src/git/*`, `tests/scm/*`, `docs/contracts/COMMAND_CONTRACTS_V1.md`.
- **Verification:** scm fixture test suite + `node dist/cli.js analyze-pr --json`.
- **Docs summary:** document edge cases, fallback behavior, confidence flags.

### Prompt Cluster 3: Failure intelligence loop MVP
- **Objective:** Ensure every meaningful failure maps to durable prevention artifacts.
- **Plan:** add ingestion/classification/prevention commands, taxonomy schema, artifact suggestion generator.
- **Files:** `packages/engine/src/failures/*`, `packages/core/src/contracts/*`, `packages/cli/src/commands/*`, `docs/failures/README.md`.
- **Verification:** `node dist/cli.js failures ingest --json`, `node dist/cli.js failures classify --json`, tests.
- **Docs summary:** define taxonomy, prevention mapping, closure criteria blocking recurrence.
