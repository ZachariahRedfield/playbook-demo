# playbook-demo

A tiny repository that demonstrates Playbook analysis in under 30 seconds.

## Quickstart

Requires only Node.js.

```bash
npx playbook analyze
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

This repo includes a GitHub Actions workflow at `.github/workflows/playbook.yml` that runs Playbook verify on pull requests and pushes to `main`.

It uses the reusable action directly:

```yaml
- name: Playbook verify
  uses: ZachariahRedfield/playbook/actions/verify@main
  with:
    playbook_version: latest
    node_version: '22'
    args: --ci
```
