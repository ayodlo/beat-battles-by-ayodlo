MCP (Model Context Protocol)

What it is

MCP is an open standard for connecting Claude to outside tools and data. An MCP server is a small program that exposes a set of tools (and sometimes data) to Claude. Claude Code is the client that calls them.

Without MCP, Claude can only read and edit files and run shell commands. With it, Claude can also query a database, read a GitHub issue, check a Sentry error, or drive a browser.

What it's useful for

┌──────────────────┬───────────────────────────────────────┐
│ Use │ Example servers or tools │
├──────────────────┼───────────────────────────────────────┤
│ Source control │ GitHub, GitLab, Linear, Jira │
│ and issues │ │
├──────────────────┼───────────────────────────────────────┤
│ Databases │ Postgres, SQLite (query your real │
│ │ data instead of guessing) │
├──────────────────┼───────────────────────────────────────┤
│ Browsers and │ Playwright, Chrome DevTools (open the │
│ testing │ app, click, read the console) │
├──────────────────┼───────────────────────────────────────┤
│ Monitoring │ Sentry, Datadog (pull the actual │
│ │ stack trace) │
├──────────────────┼───────────────────────────────────────┤
│ Docs and │ Library docs, Notion, Google Drive, │
│ knowledge │ Slack │
├──────────────────┼───────────────────────────────────────┤
│ Design │ Figma │
└──────────────────┴───────────────────────────────────────┘

For this repo, a Postgres server would let Claude inspect your Battle, Submission and Vote tables, and a browser server would let it test the upload and vote flow.

How to use them

Add a server (run in your terminal, not inside Claude):

# Remote server over HTTP

claude mcp add --transport http <name> <url>

# Local server that runs as a process

claude mcp add <name> -- npx -y <package-name>

On native Windows, local npx servers usually need a wrapper: claude mcp add <name> -- cmd /c npx -y <package-name>.

Manage them:

claude mcp list # see configured servers
claude mcp remove <name>
/mcp # inside Claude Code: status, tools, authenticate

Scope controls where the config lives:

- --scope local: just you, this project (default).
- --scope project: saved to .mcp.json in the repo, so the team shares it.
- --scope user: all your projects.

Once connected, you don't call tools by name. Just ask ("check the Votes table for duplicate rows") and Claude picks the tool. You can also pre-approve one by its full name in permissions.allow, such as mcp**postgres**query.

Token costs

This ties back to your token usage:

- Every enabled server adds its tool definitions to every request. A server with many tools can cost thousands of tokens per turn, even when idle.
- Tool results also land in your context, and database or browser output can be large.

So:

- Add only what you actually use, and remove or disable the rest. Check /context and /mcp to see the cost.
- Prefer servers with few, focused tools.
- If a plain CLI does the job (gh for GitHub, psql for Postgres), the CLI is often cheaper than an MCP server, because it adds no standing tool definitions.

Safety

- An MCP server runs with your permissions. Install only servers from sources you trust.
- Use read-only database credentials for anything pointing at real data.
- Tool results are untrusted text. A web page or ticket could contain instructions aimed at the model, so be careful with servers that fetch outside content.
- Servers that can write or delete (database writes, sending messages) should keep their permission prompts on.

What's connected in this session

You already have a few built in through claude.ai: Claude Docs and Google Drive (not yet authenticated). Run /mcp to see them and their status.

I can help you pick one for this project (Postgres is the most useful here) and walk through adding it.
