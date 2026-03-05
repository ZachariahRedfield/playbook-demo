# playbook-demo

A tiny repository that demonstrates Playbook analysis in under 30 seconds.

## Quickstart

Requires only Node.js.

> Why scoped package commands? The unscoped `playbook` package name on npm is already owned by another project, so this demo must invoke `@zachariahredfield/playbook` explicitly.

```bash
npx --yes @zachariahredfield/playbook@latest analyze
npx --yes @zachariahredfield/playbook@latest verify --ci
npx --yes @zachariahredfield/playbook@latest analyze --ci
npx --yes @zachariahredfield/playbook@latest analyze --json
```

## Example output

```text
$ npx --yes @zachariahredfield/playbook@latest analyze
✓ Scanned 3 files
✓ Found 0 critical issues
✓ Report ready
```

## CI example

This repo includes a GitHub Actions workflow at `.github/workflows/playbook.yml` that runs Playbook commands on pull requests and pushes to `main`.

```yaml
- name: Playbook verify
  run: npx --yes @zachariahredfield/playbook@latest verify --ci
```
