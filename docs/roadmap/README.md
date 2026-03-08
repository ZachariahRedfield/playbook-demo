# Roadmap Workflow Contract

`docs/roadmap/ROADMAP.json` is the source of truth.

## Required feature fields
- `feature_id`
- `version`
- `title`
- `goal`
- `commands`
- `contracts`
- `tests`
- `docs`
- `dependencies`
- `package_ownership`
- `verification_commands`
- `status`

## Status flow
- `planned` -> `in_progress` -> `completed`

## Delivery loop
`roadmap item -> design -> implementation -> contracts -> docs -> verification -> PR -> roadmap update`

## Enforcement
- Validate schema with `node scripts/validate-roadmap.mjs`.
- PRs must include `Roadmap-ID: PB-...` mapped to a valid `feature_id`.
