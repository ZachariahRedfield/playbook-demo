# Artifact Evolution Policy

- Artifact envelopes MUST keep `schemaVersion` and only increment on breaking output changes.
- Artifact field additions are additive-only for minor updates and must preserve deterministic ordering.
- Any change to JSON command output must include:
  1. updated command contract docs,
  2. test updates,
  3. roadmap feature linkage in `docs/roadmap/ROADMAP.json`.
