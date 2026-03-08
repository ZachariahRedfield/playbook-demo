# Playbook Demo Repository

Playbook is the deterministic repo runtime and trust layer for humans and AI agents. This repository is a deliberately small fixture with **intentional, safe findings** so you can experience deterministic repo intelligence plus reviewed remediation on a known, repeatable baseline.

## Quick demo (canonical ladder)

This is the primary public walkthrough for this demo using the published package `@fawxzzy/playbook`.

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

## What this demo proves

- Deterministic repo intelligence on a small, known repository.
- Explainable findings, rules, and modules.
- Reviewed remediation through `verify -> plan -> apply -> verify`.
- Repeatable before/after behavior because this repo stays checked in with intentional initial findings.

## Expected initial state

On a fresh clone, `verify --json` reports exactly **5 findings** (PB001–PB005).

The checked-in source intentionally remains in the imperfect initial state so the walkthrough is repeatable. A remediation pass resolves the findings, and a final `verify --json` passes.

## Maintainer / self-hosted demo flow

This repository also includes a self-hosted demo CLI path for maintainers and branch-accurate artifact refresh. It is not the primary public consumer walkthrough.

```bash
npm run build
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

This regenerates:

- `.playbook/repo-index.json`
- `.playbook/demo-artifacts/*.json`
- `.playbook/demo-artifacts/doctor.txt`
- `docs/ARCHITECTURE_DIAGRAMS.md`

## Deterministic delivery checks

```bash
npm run validate:roadmap
npm run validate:delivery
npm run ci:determinism
```

Roadmap contract entries live in `docs/roadmap/ROADMAP.json`, and command contracts live in `docs/contracts/COMMAND_CONTRACTS_V1.md`.
