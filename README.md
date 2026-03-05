# playbook-demo

A tiny repository that demonstrates Playbook analysis in under 30 seconds.

## Quickstart

Requires only Node.js.

> Demo note: this repo currently installs Playbook from GitHub because the npm package is not published yet. Once published, switch these commands to scoped `npx --yes @zachariahredfield/playbook@latest ...`.

```bash
npm i --no-save github:ZachariahRedfield/playbook#main
npx playbook analyze
npx playbook verify --ci
npx playbook analyze --ci
npx playbook analyze --json
```

## Example output

```text
$ npx playbook analyze
✓ Scanned 3 files
✓ Found 0 critical issues
✓ Report ready
```

## CI example

This repo includes a GitHub Actions workflow at `.github/workflows/playbook.yml` that runs Playbook commands on pull requests and pushes to `main`.

```yaml
- name: Playbook verify
  run: npx playbook verify --ci
```
