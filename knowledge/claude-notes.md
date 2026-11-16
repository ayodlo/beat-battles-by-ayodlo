Using Claude Code Effectively

1. Manage context

Every message re-sends the whole conversation, so a long session costs more per turn and gets less accurate as it fills.

- /clear between unrelated tasks. This is the biggest saver.
- /compact when you're mid-task and the history is bloated. You can steer it: /compact keep the failing test names and the DB schema decisions.
- /context shows what's using your window (tool results, files, MCP tool definitions).
- /resume and claude --continue pick up old sessions, so you can /clear without losing work.
- Start fresh once a task is done. Don't let one session run for days.

2. Write precise prompts

Vague prompts make Claude explore, and exploring costs tokens.

- Name files and symbols: "In apps/api/src/auth/session.ts, refreshToken() doesn't handle expiry. Fix it" beats "fix the auth bug."
- Say how to verify: "Run npm test -- session to confirm." Claude can then check its own work.
- State constraints: "Don't change the public API." "Match the style in userService.ts."
- Give errors verbatim. Paste the stack trace, not a description of it.
- Scope small. One feature or one bug per prompt.

3. Plan before big changes

- Press Shift+Tab to cycle permission modes. Plan mode makes Claude research and propose without editing.
- Review the plan and correct it before any code is written. Fixing a plan costs far less than fixing a wrong implementation.
- For small, obvious changes, skip planning and just ask.

4. Pick the right model and effort

- Use a cheaper, faster model (Haiku or Sonnet) for routine edits, renames, boilerplate and tests.
- Use a stronger model (Opus) for architecture, tricky debugging and large refactors.
- Switch with /model. Lower reasoning effort for simple tasks and raise it only for hard ones.
- You just set Sonnet as your default, which is a sensible baseline for most daily work.

5. Use CLAUDE.md

Run /init once to generate a CLAUDE.md for the repo. Keep it short, because it loads every session:

- Build, test and lint commands
- Architecture notes that aren't obvious from the code (for example, your monorepo layout)
- Conventions and gotchas ("never edit generated files in /dist")

Don't paste in things Claude can learn by reading the code. You can also use #-style quick memory additions or ask "remember that we use pnpm."

6. Keep tool output small

- Ask for targeted reads: "look at lines 100-200" or "grep for refreshToken" rather than "read the whole codebase."
- Tell Claude to pipe noisy commands through tail or grep (for example npm test 2>&1 | tail -30).
- Disable unused MCP servers. Each one adds tool definitions to every request. Check with /context and /mcp.

7. Use subagents for side quests

Subagents run in their own context and return only a summary, so research doesn't clutter your main session.

- "Use a subagent to find everywhere we call createBattle and summarize the patterns."
- Good for broad searches, code review and investigating unfamiliar areas.
- Don't spawn them for simple lookups, since each starts cold and costs its own tokens.

8. Automate the repetitive stuff

- Hooks (via /update-config or settings.json): auto-run your formatter or linter after every edit, so you never burn a turn asking.
- Permissions allowlist: run /fewer-permission-prompts to stop approving the same safe commands repeatedly.
- Custom slash commands and skills: save prompts you repeat ("review this diff for X").
- claude -p "prompt" runs non-interactively for scripts and CI.

9. Everyday workflow

1. /clear, then describe the task with file names and a verify command.
1. Use plan mode for anything touching more than a couple of files.
1. Let Claude implement and run tests.
1. Review with git diff and /code-review.
1. Commit, then /clear for the next task.

1. Common mistakes

┌───────────────────────┬────────────────────────────────┐
│ Mistake │ Fix │
├───────────────────────┼────────────────────────────────┤
│ One endless session │ /clear per task │
├───────────────────────┼────────────────────────────────┤
│ "Make it better" │ Specific goal plus a check │
├───────────────────────┼────────────────────────────────┤
│ Pasting huge files │ Reference by path │
├───────────────────────┼────────────────────────────────┤
│ Many idle MCP servers │ Disable what you don't use │
├───────────────────────┼────────────────────────────────┤
│ Using the top model │ Match model to difficulty │
│ for everything │ │
├───────────────────────┼────────────────────────────────┤
│ Interrupting late │ Press Esc early when it heads │
│ │ the wrong way, and redirect │
└───────────────────────┴────────────────────────────────┘

Habits to start with: /clear often, name your files, give a way to verify, and use plan mode for anything non-trivial.

I can go deeper on any of these, such as setting up a CLAUDE.md, hooks, or an allowlist for this repo.

Viewing Token Usage in Claude Code

Details vary by version and plan, so if something below doesn't match what you see, run /help to check the commands your version has.

Commands inside Claude Code

Command: /usage
What it shows: Your plan's usage limits and how
much you've used (session and weekly windows)
on subscription plans.
────────────────────────────────────────
Command: /cost
What it shows: Token usage and cost for the
current session. This is most meaningful on
API billing. On a subscription it shows
tokens but not a bill.
────────────────────────────────────────
Command: /context
What it shows: What's filling the current
context window: system prompt, tools, MCP
definitions, CLAUDE.md, messages. This is the
best tool for finding waste.
────────────────────────────────────────
Command: /status
What it shows: Account, model, login method and
plan info.
────────────────────────────────────────
Command: /model
What it shows: Switch models, which changes how
fast you burn through limits.

Live display: the status line

Run /statusline and describe what you want, for example "show model, context % used, and session cost". It then sits at the bottom of the terminal, so you can watch context fill up without running a command.

Average usage

Claude Code doesn't have a built-in "average per task" view. Options:

- Session transcripts: each session is stored as JSONL under ~/.claude/projects/ (for you, C:\Users\theek\.claude\projects\...). Each assistant message records token counts.
- Community tools: ccusage (npx ccusage) reads those transcripts and reports daily, weekly, monthly and per-session totals, including cache tokens. It's third-party, so review it before trusting it.
- API users: the Anthropic Console shows usage and spend by day, model and API key, with CSV export.

Limits

- Subscription (Pro/Max): limits are usage-based, not a fixed token count. There's typically a rolling session window (resetting every few hours) plus a weekly cap. Heavier models and long contexts use more of it. Check /usage and your account's usage settings on claude.ai for the current numbers, because they change.
- API: limits are rate limits (requests, input tokens and output tokens per minute) tied to your usage tier, visible in the Console under limits. Spend is pay-per-token.
- Context window: a separate limit per conversation. When it fills, Claude auto-compacts the history, which loses detail.

Concepts worth knowing

- Input vs. output tokens: output costs several times more per token than input, but input volume is usually much larger because the full conversation is re-sent every turn.
- Prompt caching: repeated context (system prompt, CLAUDE.md, earlier messages) is cached and billed at a steep discount, but the cache expires after a period of idleness. A long pause means the next turn re-reads everything at full price.
- Thinking tokens: extended reasoning counts as output. Higher effort settings use more.
- What inflates usage: big file reads, verbose command output, many MCP servers, subagents (each has its own context), and long sessions.
- Tool schemas count: every enabled MCP server's tool list is sent on every request.

A simple monitoring routine

1. Set up /statusline to show context % and cost.
2. Check /context when a session feels sluggish or expensive.
3. Check /usage at the start of a heavy day to see your headroom.
4. If you want history and averages, run npx ccusage weekly.

I can set up a status line for you, or look at your transcripts to compute your averages if you'd like.
