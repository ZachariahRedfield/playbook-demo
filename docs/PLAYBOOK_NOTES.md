# Playbook Notes

- `npx` command reliability depends on **both** package naming and executable metadata:
  - Use the scoped package name when the unscoped name is not owned by your project.
  - Ensure `package.json` declares a `bin` mapping for the CLI entry point.
  - Ensure publish artifacts include the bin target (`dist/cli.js`) and verify this with `npm pack --dry-run` in CI.

- For pre-publish demos, `npx` requires a published package + `bin`; until publish, install from GitHub first (`npm i --no-save github:ZachariahRedfield/playbook#main`) and then run `npx playbook ...`.
