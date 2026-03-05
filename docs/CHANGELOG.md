# Changelog

## Unreleased

### What changed
- Updated all demo npx invocations to use the scoped package: `@zachariahredfield/playbook`.
- Added CLI publish metadata (`bin`, `files`) and a `prepack` build step so the executable is always generated before packaging.
- Added a lightweight tarball validation script (`npm run verify:pack-bin`) that checks `npm pack --dry-run` output for `dist/cli.js`.
- Updated GitHub Actions workflow to clear npm auth, install Playbook from `github:ZachariahRedfield/playbook#main`, and run `npx playbook ...` commands in CI.
- Added a `prepare` script (`pnpm -w build || npm run build`) so GitHub installs build the CLI before `bin` resolution.
- Updated README quickstart and CI snippets to document GitHub install usage until the npm package is published.
- Made `verify:pack-bin` CI-portable by replacing `rg` with POSIX `grep -q` so GitHub-hosted runners can validate tarball contents without extra dependencies.
- Updated `prepare` to silence missing `pnpm` noise (`pnpm -w build 2>/dev/null || npm run build`) while preserving fallback build behavior for GitHub installs.
- Improved CLI UX for invalid commands by emitting an explicit unknown-command error and listing supported commands.

### Why
- The unscoped npm package name `playbook` is owned by another project, causing `npx playbook ...` to resolve incorrectly and fail with "could not determine executable to run".
- The package is not published on npm yet, so CI needs a GitHub install path to avoid `npx` lookup failures.
- GitHub installs must run a build before CLI resolution so `bin` points to an existing `dist/cli.js` target.
- GitHub-hosted runners do not include ripgrep by default, so scripts must use portable tools to avoid exit code 127 failures.
- Suppressing expected `pnpm` stderr keeps CI logs cleaner while still ensuring the npm fallback build runs.
- Clear command errors improve operability for CI and demo users invoking the CLI from GitHub installs.
