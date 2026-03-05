# Changelog

## Unreleased

### What changed
- Updated all demo npx invocations to use the scoped package: `@zachariahredfield/playbook`.
- Added CLI publish metadata (`bin`, `files`) and a `prepack` build step so the executable is always generated before packaging.
- Added a lightweight tarball validation script (`npm run verify:pack-bin`) that checks `npm pack --dry-run` output for `dist/cli.js`.
- Updated GitHub Actions workflow to clear npm auth, install Playbook from `github:ZachariahRedfield/playbook#main`, and run `npx playbook ...` commands in CI.
- Added a `prepare` script (`pnpm -w build || npm run build`) so GitHub installs build the CLI before `bin` resolution.
- Updated README quickstart and CI snippets to document GitHub install usage until the npm package is published.

### Why
- The unscoped npm package name `playbook` is owned by another project, causing `npx playbook ...` to resolve incorrectly and fail with "could not determine executable to run".
- The package is not published on npm yet, so CI needs a GitHub install path to avoid `npx` lookup failures.
- GitHub installs must run a build before CLI resolution so `bin` points to an existing `dist/cli.js` target.
