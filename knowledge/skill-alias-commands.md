push

git acp "your message" does all three at once. The "acp" stands for add, commit, push.

How it differs from /ship

┌───────────────────────┬───────────────┬─────────────────┐
│ │ /ship │ git acp │
├───────────────────────┼───────────────┼─────────────────┤
│ Who writes the commit │ The model │ You │
│ message │ (Haiku) │ │
├───────────────────────┼───────────────┼─────────────────┤
│ Uses tokens │ A small │ None │
│ │ amount │ │
├───────────────────────┼───────────────┼─────────────────┤
│ Works outside Claude │ No │ Yes, in any │
│ Code │ │ terminal │
└───────────────────────┴───────────────┴─────────────────┘

So the alias is for when you already know what to say and don't want to spend a model turn on it. For example, ! git acp "fix typo in README" is instant and free.

Do you need it?

Probably not, if you're happy letting /ship write the messages. The alias is an optional extra, and /ship covers your original goal on its own. Keep the alias if you sometimes want to write your own messages or commit from a regular terminal.

I can remove it if you don't want it:

git config --global --unset alias.acp
