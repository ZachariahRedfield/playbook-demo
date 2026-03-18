# Changelog

## Unreleased

### Added
- Introduced workout feature service and domain types.
- Added a minimal app entrypoint for the demo flow.

### Changed
- Fixed the demo refresh pipeline to regenerate managed docs/contracts before `playbook doctor`, eliminating the circular dependency where stale generated docs could fail refresh before regeneration restored them.
- Added managed doc anchors and `docs/contracts/command-truth.json` generation so refresh and doctor share the same deterministic compliance baseline.

