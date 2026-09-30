# Ponpon Chen Fan Hub

This site is edited from two computers (home and work), and Claude does the commits and pushes on both. GitHub `main` is the only source of truth. Every push to `main` deploys to ponponchenarchive.com through GitHub Actions.

## Keeping the two computers in sync

- **Before editing:** make sure this checkout is up to date with `origin/main`. A SessionStart hook in `.claude/settings.json` runs `git pull --ff-only` automatically. If its output says `FAILED`, or you can't tell whether it ran, run `git pull` yourself and resolve any problem before changing files.
- **After finishing a change:** commit and push, so the other computer can pull it.
- **If a push is rejected:** run `git pull` and merge. If both computers edited the same spot (for example, both added a news card at the top of the list), keep both changes and order them by date.
- **Never** run `git push --force`. It would overwrite work pushed from the other computer.
