# Command Contracts v1

## command-registry-contract

- Command order is canonical and enforced by `src/engine/command-registry.js`.
- Metadata and runner inventory must remain synchronized.
- Help/usage output is generated from registry metadata only.

## index-contract

- `index --json` emits deterministic module/doc lists from repository state.
- Output is persisted to `.playbook/repo-index.json`.

## verify-contract

- `verify --json` emits `{ ok, findings[] }`.
- Non-empty findings return exit code `1`.

## plan-contract

- `plan --json` emits `{ count, plan[] }` where each plan step maps one finding.
- Plan ordering must be deterministic based on finding order.

## apply-contract

- `apply --json` emits `{ appliedCount, applied[] }` and executes finding fixes.
- If no findings exist, `appliedCount` is `0` and `applied` is empty.
