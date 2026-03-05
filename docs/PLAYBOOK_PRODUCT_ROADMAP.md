# Playbook Product Roadmap

## Install + CLI reliability

- [x] Demo repo CI switched to scoped CLI invocation (`npx --yes @zachariahredfield/playbook@latest ...`).
- [x] README quickstart and CI snippets switched to scoped package install story.
- [x] Added explicit note on npm `playbook` name collision and why the scope is required.
- [x] Package publish flow now validates that `dist/cli.js` is shipped in tarballs.
