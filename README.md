# Playbook Demo Repository

A deliberately small repository with **intentional, safe findings** so you can experience Playbook's repository-intelligence + remediation workflow in a deterministic way.

## Demo flow (deterministic)

```bash
npx playbook index --json
npx playbook explain architecture --json
npx playbook explain PB001 --json
npx playbook explain workouts --json
npx playbook rules --json
npx playbook verify --json
npx playbook plan --json
npx playbook apply --json
npx playbook verify --json
npx playbook diagram --repo . --out docs/ARCHITECTURE_DIAGRAMS.md
npx playbook doctor
```

## Refresh generated demo artifacts

Use the built-in CLI commands (no manual editing of artifact files):

```bash
npm run demo:refresh
```

This regenerates:

- `.playbook/repo-index.json`
- `.playbook/demo-artifacts/*.json`
- `.playbook/demo-artifacts/doctor.txt`
- `docs/ARCHITECTURE_DIAGRAMS.md`

## Expected initial state

On a fresh clone, `verify --json` reports exactly **5 findings** (PB001–PB005). `apply --json` resolves the findings, and a final `verify --json` passes.

The checked-in source intentionally stays in the imperfect initial state so the demo is repeatable.

## Maintainer note

If Playbook command contracts change, update the CLI + `scripts/refresh-demo-artifacts.mjs` and rerun `npm run demo:refresh` so documentation and artifacts stay aligned.
