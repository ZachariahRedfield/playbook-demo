# Changelog

## Unreleased

### What changed
- Updated all demo npx invocations to use the scoped package: `@zachariahredfield/playbook`.
- Added CLI publish metadata (`bin`, `files`) and a `prepack` build step so the executable is always generated before packaging.
- Added a lightweight tarball validation script (`npm run verify:pack-bin`) that checks `npm pack --dry-run` output for `dist/cli.js`.
- Updated GitHub Actions workflow and README quickstart snippets to use scoped commands for `verify` and `analyze`.

### Why
- The unscoped npm package name `playbook` is owned by another project, causing `npx playbook ...` to resolve incorrectly and fail with "could not determine executable to run".
- Scoped execution guarantees the intended CLI package is used in local runs and CI.
