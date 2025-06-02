# 🐒 git-chimp

> Because writing commit messages and pull requests sucks. Let the AI do it.

[![npm version](https://img.shields.io/npm/v/git-chimp)](https://www.npmjs.com/package/git-chimp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://img.shields.io/github/actions/workflow/status/MarkRabey/git-chimp/release.yml)](https://github.com/MarkRabey/git-chimp/actions)

---

`git-chimp` automates your Git commits and pull requests using AI. It analyzes your staged changes or commit history, then generates surprisingly coherent commit messages and PRs—so you can stop typing “fix stuff” for the fifth time today.

---

## 🧠 Features

- 🧵 Commit message generation from your actual staged changes
- 🚀 GPT-generated pull request descriptions from commit diffs
- ⚙️ Setup wizard to configure OpenAI and GitHub tokens
- 🧃 Options to run in interactive or non-interactive mode
- 🫣 Optional fallback to detect your repo from `.git/config`

---

## 📦 Installation

```bash
npm install -g git-chimp
```

Or use it via npx:

```bash
npx git-chimp commit
```

---

## 🔧 Configuration

Run this once to get set up:

```bash
git-chimp init
```

This creates a .env file with:

```env
OPENAI_API_KEY=your-openai-key
GITHUB_TOKEN=your-github-token
# Optional – will be auto-detected from .git if omitted
GITHUB_REPO=username/repo
```

### Get your API keys:

- 🧠 OpenAI: https://platform.openai.com/account/api-keys
- 🐙 GitHub Token: https://github.com/settings/tokens _(Requires repo scope)_

---

## 🛠 Configuration

`git-chimp` supports configuration via a `.git-chimprc` file at the root of your repo. This should be a plain JSON file (no .json extension).

### Example `.git-chimprc`:

```json
{
  "tone": "sarcastic",
  "enforceSemanticPrTitles": true,
  "model": "gpt-4o",
  "prMode": "draft"
}
```

### Available Config Options

| Key                       | Type      | Description                                                                         |
| ------------------------- | --------- | ----------------------------------------------------------------------------------- |
| `tone`                    | `string`  | Sets the writing style, e.g., `"corporate-safe"`, `"dry sarcasm"`, `"chaotic evil"` |
| `model`                   | `string`  | OpenAI model to use. One of: `gpt-3.5-turbo`, `gpt-4`, `gpt-4o`, `gpt-4o-mini`      |
| `enforceSemanticPrTitles` | `boolean` | If `true`, PR titles follow semantic-release style (e.g., `feat:`)                  |
| `prMode`                  | `string`  | One of: `open` (default), `draft`, or `display` (just show the PR content)          |


### Command-Line Overrides
You can also override certain config options via CLI flags (these take precedence over `.git-chimprc`):

```bash
git-chimp pr --tone "inspired by Linus Torvalds" --model gpt-4o --pr-mode draft
```

That would skip enforcing semantic PR title style for that invocation, regardless of the `.git-chimprc` setting.

---

## 🧪 CLI Usage

### `config`

Store project defaults.

```bash
git-chimp config --list
git-chimp config --get model
git-chimp config --set model --value gpt-4o
```

### `commit`

```bash
git add .
git-chimp commit
```

#### Options:

| Flag              | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `--tone <style>`  | Optional writing style for commit messages (e.g., `"corporate-safe"`)    |
| `--model <model>` | OpenAI model to use (e.g., `gpt-3.5-turbo`, `gpt-4o`)                    |
| `-c`, `--custom`  | Use your own lovingly typed commit message (you beautiful control freak) |
| `-m`, `--message` | Print GPT commit messages to stdout and exit (good for CI, scripting)    |


### `pr`

```bash
git-chimp pr
```

Generates a PR description and opens one on GitHub.

#### Options:

| Flag               | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| `--tone <style>`   | Optional writing style for the PR (e.g., `"professional"`, `"snarky"`) |
| `--model <model>`  | OpenAI model to use for generation                                     |
| `--pr-mode <mode>` | One of: `open`, `draft`, or `display`                                  |
| `-u`, `--update`   | Updates an existing PR instead of creating a new one (if it exists)    |

---
## 💡 Pro Tip
The config system is merge-friendly. It works like this (highest priority wins):

Command-line flags (e.g., --tone)

.git-chimprc config

Defaults baked into the tool

So yeah—you can go full control freak without ever touching a config file, or commit to the chimp with a persistent setup.

---

## 🧨 Can I override git commit?

**Yes... but with caution.** You _can_ alias `git commit` to use `git-chimp`, but this disables standard Git commit behavior.

Here’s an alias override (not recommended unless you're into danger):

```bash
git config --global alias.commit '!git-chimp commit'
```

For a safer setup, try:

```bash
git config --global alias.chimp-commit '!git-chimp commit'
git config --global alias.chimp-pr '!git-chimp pr'
```

Then use:

```bash
git chimp-commit
git chimp-pr
```

Or if you're lazy and proud:

```bash
alias gc='git-chimp commit'
alias gp='git-chimp pr'
```

---

## 🧪 Upcoming Features

Here’s what’s cooking in the banana lab:

- ~~🎭 `--tone` option for different writing styles: _e.g., “corporate-safe”, “dry sarcasm”, “inspired by Linus Torvalds”_~~ *added in v0.4.3*
- 📓 `git-chimp changelog` – auto-generate changelogs from commits
- 🍿 Emoji support and Conventional Commit modes
- ⚙️ `.chimpconfig` file for personal and team-level preferences
- 🔀 Branch naming assistant (`git-chimp name`)
- 🧪 Dry run support (`--dry-run`)

---

## 📦 Version

This is pre-1.0 software. The API may change. The monkey may escape.

---

## 🧠 Built With

- [OpenAI GPT-4](https://platform.openai.com/docs)
- [simple-git](https://github.com/steveukx/git-js)
- [octokit/rest.js](https://github.com/octokit/rest.js)
- [chalk](https://github.com/chalk/chalk)
- Your rage at poorly written commit messages

---

## 🐛 Contributing

Issues, feature requests, PRs, and monkey memes all welcome. Open a PR or start a discussion.

---

## ⚖️ License

MIT. Use it, abuse it, just don’t sell it back to me on Fiverr.

---

## 🐵 Parting Wisdom

> “Let the monkey write the messages. You’ve got bigger bugs to squash.”
> _– Ancient Git Proverb_
