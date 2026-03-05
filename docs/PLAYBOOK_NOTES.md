# Playbook Notes

- `npx` command reliability depends on **both** package naming and executable metadata:
  - Use the scoped package name when the unscoped name is not owned by your project.
  - Ensure `package.json` declares a `bin` mapping for the CLI entry point.
  - Ensure publish artifacts include the bin target (`dist/cli.js`) and verify this with `npm pack --dry-run` in CI.
