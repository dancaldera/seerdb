---
"seerdb": minor
---

Added direct OpenCode.ai integration via `sdb opencode run` command. Automatically combines SeerDB agent documentation with user message and executes OpenCode.ai with full context. Default model is opencode/big-pickle. Removed broken --agent-help flag. Fixed --copy command to read AGENTS.md directly instead of recursive call. Updated README.md with OpenCode.ai integration examples.
