# Architecture

This repository is intentionally small so Playbook can reason about it quickly.

It is also intentionally initialized with a few safe discipline gaps for demo purposes. Those gaps are expected on first run and are resolved by `npx playbook fix`.

## Source layout

- `src/app/index.ts` boots the tiny demo workflow.
- `src/features/workouts/*` contains workout domain logic.
- `src/features/users/*` contains user profile logic.
- `src/shared/utils.ts` contains cross-cutting helpers.

## Features

- workouts

## Structural conventions used by the demo

- Feature-domain exported types should use explicit names (for example, `WorkoutPlan`) so service contracts are readable at a glance.
- Service modules should import the feature's canonical domain type name.

## Documentation model

- `docs/` holds architecture and process documentation.
- `.playbook/` stores scenario definitions for the guided demo flow.
