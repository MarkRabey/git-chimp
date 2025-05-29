import { Command } from 'commander';
import { handleCommitCommand } from './commit.js';
import { handlePR } from './pr.js';
import { handleInit } from './init.js';
// Import JSON using createRequire for NodeNext compatibility
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

const program = new Command();

export function runCLI() {
  program
    .name('git-chimp')
    .description(
      'Automate your commit messages and PRs with GPT. Because writing them sucks.'
    )
    .version(version);

  program
    .command('commit')
    .description(
      'Generate a commit message with GPT based on staged changes'
    )
    .option('-c, --custom', 'Write a custom commit message')
    .option(
      '-m, --message',
      'Non-interactive mode, output commit message to stdout'
    )
    .action(handleCommitCommand);

  program
    .command('pr')
    .option(
      '-u, --update',
      'Automatically update existing PR if it exists'
    )
    .description(
      'Generate a pull request with GPT based on recent commits'
    )
    .action(handlePR);

  program
    .command('init')
    .description('Set up your OpenAI and GitHub tokens')
    .action(handleInit);

  program.parse(process.argv);
}
