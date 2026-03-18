# Playbook Demo Repository

Playbook is the deterministic repo runtime and trust layer for humans and AI agents. This repository is a deliberately small fixture with **intentional, safe findings** so you can experience deterministic repo intelligence plus reviewed remediation on a known, repeatable baseline.

## Quick demo (canonical ladder)

Public consumer walkthrough (when the published package is available):

```bash
npm install

npx @fawxzzy/playbook ai-context --json
npx @fawxzzy/playbook ai-contract --json
npx @fawxzzy/playbook context --json

npx @fawxzzy/playbook index --json
npx @fawxzzy/playbook query modules --json
npx @fawxzzy/playbook explain architecture --json
npx @fawxzzy/playbook explain PB001 --json
npx @fawxzzy/playbook explain workouts --json
npx @fawxzzy/playbook rules --json

npx @fawxzzy/playbook verify --json
npx @fawxzzy/playbook plan --json > .playbook/plan.json
npx @fawxzzy/playbook apply --from-plan .playbook/plan.json
npx @fawxzzy/playbook verify --json

npx @fawxzzy/playbook diagram --repo . --out docs/ARCHITECTURE_DIAGRAMS.md
npx @fawxzzy/playbook doctor
```

Canonical ladder: **bootstrap -> index/query/explain -> verify -> plan -> apply -> verify**. Playbook also supports `analyze` in broader workflows, but this demo keeps the ladder above as the primary path.

If the public package is unavailable in your environment, use the maintainer/source-built path below.

## What this demo proves

- Deterministic repo intelligence on a small, known repository.
- Explainable findings, rules, and modules.
- Reviewed remediation through `verify -> plan -> apply -> verify`.
- Repeatable before/after behavior because this repo stays checked in with intentional initial findings.

## Expected initial state

On a fresh clone, `verify --json` reports exactly **4 active findings** (PB002–PB005). `PB001` remains a guided rule in the demo, but managed-doc regeneration now keeps that governance item satisfied in the checked-in baseline.

The checked-in source intentionally remains in the imperfect initial state so the walkthrough is repeatable. A remediation pass resolves the findings, and a final `verify --json` passes.

## Maintainer / self-hosted demo flow

This repository also includes a self-hosted demo CLI path for maintainers and branch-accurate artifact refresh. It is not the primary public consumer walkthrough.

```bash
node scripts/demo-refresh.mjs --dry-run --feature-id "PB-V1-DEMO-REFRESH-001"
npm run demo:refresh
npm run validate:roadmap
npm run validate:delivery
```

Local scripts and `dist/cli.js` are the branch-accurate path for refreshing committed demo artifacts and validating the demo repository itself.

## Refresh generated demo artifacts

Under the maintainer flow, refresh generated artifacts via the local CLI/scripts rather than manual edits:

```bash
npm run demo:refresh
```

To drive refresh from an external Playbook CLI build (for example a main `playbook` repository checkout), inject the CLI entrypoint with `PLAYBOOK_CLI_PATH`:

```bash
PLAYBOOK_CLI_PATH=/absolute/path/to/playbook/packages/cli/dist/main.js npm run demo:refresh
```

`PLAYBOOK_CLI_PATH` is executed as `node <cli-path> ...args`. If it is unset, refresh falls back to this repo's local `dist/cli.js`.

For machine-readable Playbook commands (`--json`), refresh evaluates success using both structured fields (`ok: true` and `exitCode: 0`) and process exit status (`0`). Warning findings remain advisory output and do not fail artifact refresh. The refresh pipeline now regenerates managed docs/contracts before running `playbook doctor`, keeping doctor strict at the correct boundary.
Refresh now shells through `npm run docs:update`'s underlying script (`node scripts/update-managed-docs.mjs`) before `playbook doctor` and fails early if `docs/contracts/command-truth.json` is still missing, so strict validation only runs after its managed inputs exist.

This regenerates:

- `.playbook/repo-index.json` (main Playbook-compatible `RepositoryIndex` contract fields: `schemaVersion`, `framework`, `language`, `architecture`, `modules`, `database`, `rules`)
- `.playbook/demo-artifacts/*.json`
- `.playbook/demo-artifacts/doctor.txt`
- `docs/contracts/command-truth.json`
- `docs/ARCHITECTURE_DIAGRAMS.md`

Refresh intentionally copies back only generated artifacts/docs. The checked-in `src/**` and `tests/**` baseline remains intentionally imperfect so the walkthrough starts from a deterministic initial findings state.
Managed docs regeneration supports strict validation and refresh determinism, but it does not change the demo contract: a fresh checkout still starts with intentional verify findings that are resolved through the verify → plan → apply walkthrough.

## Deterministic delivery checks

```bash
npm run validate:roadmap
npm run validate:delivery
npm run ci:determinism
```

Roadmap contract entries live in `docs/roadmap/ROADMAP.json`, and command contracts live in `docs/contracts/COMMAND_CONTRACTS_V1.md`.
`npm run ci:determinism` intentionally validates the fail-first demo contract by checking that fresh `verify --json` fails with PB002–PB005 in a temporary fixture, then confirming `plan`/`apply` lead to a passing `verify --json`.
