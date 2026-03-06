# Architecture

This repository is intentionally small so Playbook can reason about it quickly.

## Source layout

- `src/app/index.ts` boots the tiny demo workflow.
- `src/features/workouts/*` contains workout domain logic.
- `src/shared/utils.ts` contains cross-cutting helpers.

## Documentation model

- `docs/` holds architecture and process documentation.
- `.playbook/` stores scenario definitions for the demo flow.
