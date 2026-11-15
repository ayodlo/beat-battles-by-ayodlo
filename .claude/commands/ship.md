---
description: Stage all, commit with a generated message, and push
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git push:*)
model: haiku
disable-model-invocation: true
---
Changes to commit:
!`git add -A && git diff --cached --stat`

Write a one-line conventional commit message for the changes above. Run
`git commit -m "<message>"`, then `git push`.
Reply with only: Committed and pushed: <message>
