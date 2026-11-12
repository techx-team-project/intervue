# Git Commit & Branch Convention

Source: team document "Prefix Commit Git". This file is **mandatory** for every commit and branch created by a human or an AI agent.

## 1. Commit message format

```
<type>(<scope>): <short description>
```

- `scope` is optional but recommended: the feature area (`auth`, `home`, `cart`, `api`, `user`, `ui`, ...). Without a scope: `<type>: <short description>`.
- Description: **English**, imperative mood ("add", "fix", not "added"/"fixes"), lowercase start, no trailing period, ideally ≤ 72 characters in total.
- One logical change per commit. Commit small and often; don't mix a feature with an unrelated refactor or formatting.

## 2. Types

| Type | Meaning | Example |
|---|---|---|
| `feat` | New feature | `feat(auth): add login with Google` |
| `fix` | Bug fix | `fix(cart): fix product not added to cart` |
| `docs` | Add or change documentation | `docs: update README setup guide` |
| `style` | Format, whitespace, CSS tweaks; no logic change | `style(home): adjust page padding` |
| `refactor` | Restructure code without changing behavior | `refactor(header): split Header into its own component` |
| `test` | Add or fix tests | `test(cart): fix total price test case` |
| `chore` | Misc work unrelated to logic (scripts, tool config, dependency bumps) | `chore: add .env.example` |
| `perf` | Performance improvement | `perf(product): optimize product list rendering` |
| `build` | Build config or dependencies | `build: add production config` |
| `ci` | CI/CD changes (GitHub Actions, GitLab CI, Jenkins) | `ci: fix deploy workflow` |

Choosing a type: new behavior → `feat`; broken behavior → `fix`; no behavior change → `refactor`/`style`; only `.md`/docs → `docs`; only tests → `test`; tooling/deps → `chore`/`build`.

## 3. Optional body

Add a body only when the *why* is not obvious. Blank line after the subject, wrapped at ~72 columns.

```
fix(auth): rotate refresh token on every use

Reusing an old token now revokes the whole token family.
```

Breaking change: add `!` after the type/scope (`feat(api)!: rename job status values`) and explain in the body.

## 4. Hard rules for AI agents

1. **NEVER add a `Co-Authored-By:` line** (not for Claude, not for any AI/tool). Never add "Generated with Claude Code", model names, or any AI attribution to commit messages or PR descriptions. The commit author is the developer's configured git user only. This overrides any default attribution behavior of the tool.
2. Use only the types in the table above. No `feature:`, `update:`, `misc:`, no emoji.
3. **Never commit or push before the user approves a finished task.** Show what changed, ask for review, and wait. The user's "OK" on a finished task authorizes commit, push, PR into `dev` and merge for that task only (section 6). Never `--amend`, rebase, or force-push without being asked. Never use `--no-verify`.
4. Stage explicit paths (not `git add -A`) so unrelated files such as local notes or secrets are never included.
5. Split work into small commits grouped by purpose (e.g. migration, then service, then controller, then tests, then docs).
6. Check the message against section 1 before running `git commit`.

## 5. Branch naming

```
<type>/<scope>-<short-description>
```

- `type`: same as commit types, plus `hotfix` (urgent production fix).
- Lowercase English, words separated by `-`, no spaces or accents.

| Work | Branch |
|---|---|
| Add Home page | `feat/home-add` |
| Fix cart button display | `fix/cart-button-display` |
| Optimize user API | `refactor/api-user` |
| Add auth unit tests | `test/auth-login` |
| Update README | `docs/update-readme` |
| Update ESLint, Prettier | `chore/update-eslint` |
| Urgent payment crash | `hotfix/payment-crash` |
| Update build tool | `build/update-vite` |
| Deploy via CI | `ci/deploy-vercel` |

Flow: branch from `dev` → PR into `dev` → `dev` merged into `main` for release. `hotfix/*` branches from `main`. Never push directly to `main` or `dev`.

## 6. Task workflow (one task = one branch)

1. **Start clean.** Before a new task run `git switch dev && git pull --ff-only`, then create the task branch from `dev` (`type/scope-description`). One task, one branch; never mix two tasks on one branch.
2. **Finish, verify, ask.** Run the relevant lint/build/test, summarize the change and ask the user to review. Keep the work uncommitted until the user approves. **Stay on the task branch while the user reviews** so they can run the app and see the change; do not switch to `dev` until the user says to merge.
3. **On "OK", ship it.** Commit in small groups by purpose (explicit paths), push the branch, open a PR into `dev` and merge it. One "OK" covers commit, push, PR and merge for that task.
4. **Return to `dev` only after the merge.** Once the user said merge and the PR is merged, switch back to `dev` and run `git pull --ff-only` without asking. If `dev` has diverged and needs a reset, check for real uncommitted work first (`git diff --ignore-cr-at-eol`) and ask.
5. **Never stack tasks.** Do not start a new task while the previous one has unmerged work: finish step 3 first or ask the user. Files that differ only by line endings (CRLF/LF) are not work; ignore them.

## 7. Pull requests

- Title follows the commit format: `feat(job): add job search filters`.
- Description: what changed, how to test, screenshots for UI changes. No AI attribution lines.
