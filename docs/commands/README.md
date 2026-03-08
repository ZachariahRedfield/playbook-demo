# Command Model (Canonical)

## Foundation intelligence commands
- `index`: deterministic repository inventory artifacts.
- `graph`: semantic architecture graph and impact surfaces.
- `query`: deterministic machine query interface.

## Reasoning/UX commands
- `ask`: natural language interface that compiles to `query` plans.
- `explain`: narrative output grounded in graph/query evidence.
- `analyze-pr`: PR-scoped boundary/risk/impact analysis.

## Governance execution commands
- `analyze`: orchestrated health synthesis over intelligence + governance checks.
- `verify`: deterministic policy gate.
- `plan`: remediation planning.
- `apply`: guarded remediation execution.

## Ownership
All command logic is owned by engine; CLI remains thin dispatch + rendering.
