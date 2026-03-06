# Playbook Demo Repository

A small repository intentionally containing a few project-health issues so you can see Playbook detect, explain, fix, and verify them in under 30 seconds.

## Quick Start

```bash
npm install
npx playbook status
npx playbook explain
npx playbook fix
npx playbook verify
```

## What You Will See

- repository health summary
- rule violations
- explanations
- safe fixes
- successful verification

Optional deeper exploration:

```bash
npx playbook rules --explain
npx playbook analyze
```

## Demo Narrative (30 seconds)

1. `status` immediately reports the repository health and shows 3–5 realistic issues.
2. `explain` tells you why each issue matters and what Playbook will change.
3. `fix` safely applies small corrections to docs and source structure.
4. `verify` confirms the repo is healthy after fixes.

This repo doubles as:

- a product demo,
- living documentation,
- and a self-hosted example of Playbook maintaining a repository.

## Intentional Starting Issues

1. Documentation drift in `docs/ARCHITECTURE.md`.
2. Missing changelog entry in `docs/CHANGELOG.md`.
3. Checklist drift in `docs/PLAYBOOK_CHECKLIST.md`.
4. Structural inconsistency in workout type naming.
5. Missing expected artifact marker in `docs/PLAYBOOK_NOTES.md`.

See `.playbook/demo-scenarios.md` for details and command mapping.
