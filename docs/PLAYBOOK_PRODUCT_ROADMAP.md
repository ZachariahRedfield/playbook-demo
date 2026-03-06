# Playbook Product Roadmap

## Install + CLI reliability

- [x] Demo repo CI switched to scoped CLI invocation (`npx --yes @zachariahredfield/playbook@latest ...`).
- [x] README quickstart and CI snippets switched to scoped package install story.
- [x] Added explicit note on npm `playbook` name collision and why the scope is required.
- [x] Package publish flow now validates that `dist/cli.js` is shipped in tarballs.

## Demo coverage expansion

- [x] Added deterministic demo artifact refresh script powered by built-in commands.
- [x] Added index/explain/rules JSON artifact snapshots for repository intelligence walkthrough.
- [x] Added deterministic remediation snapshots (verify before/plan/apply/verify after).
- [x] Added generated architecture diagrams and doctor output artifacts.
