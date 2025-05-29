import { Command } from 'commander';
import { handleCommitCommand } from './commit.js';
import { handlePR } from './pr.js';
import { handleInit } from './init.js';
// Import JSON using createRequire for NodeNext compatibility
import { createRequire } from 'node:module';
import { handleConfig } from './config.js';
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
    .command('init')
    .description('Set up your OpenAI and GitHub tokens')
    .action(handleInit);

  program
    .command('config')
    .description(
      'Get/set git-chimp configuration in .git-chimprc (JSON format)'
    )
    .option('-l, --list', 'List current config')
    .option('-g, --get <key>', 'Get value by key')
    .option('-s, --set <key>', 'Set value')
    .option('-v, --value <val>', 'Value when used with --set')
    .action(handleConfig);

  program
    .command('commit')
    .description(
      'Generate a commit message with GPT based on staged changes'
    )
    .option(
      '--tone <tone>',
      'Set the tone of the message (e.g. sarcastic, friendly, neutral)'
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
      '--tone <tone>',
      'Set the tone of the message (e.g. sarcastic, friendly, neutral)'
    )
    .option(
      '-u, --update',
      'Automatically update existing PR if it exists',
      (val) => val !== 'true' // handles true/false as strings
    )
    .option(
      '--semantic-title',
      'Enforce semantic PR titles',
      (val) => val !== 'false'
    ) // handles true/false as strings
    .option(
      '--model <model>',
      'OpenAI model to use (gpt-3.5-turbo | gpt-4 | gpt-4o | gpt-4o-mini)'
    )
    .description(
      'Generate a pull request with GPT based on recent commits'
    )
    .action(handlePR);

  program.parse(process.argv);
}
