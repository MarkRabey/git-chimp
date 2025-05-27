#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import { runCommitFlow } from './commit';
import { runPRFlow } from './pr';

const program = new Command();

program
  .name('commit-chimp')
  .description(
    'Generate commit messages and PRs like a semi-evolved genius'
  )
  .version(version);

program
  .command('commit')
  .description('Generate a commit message based on staged changes')
  .action(runCommitFlow);

program
  .command('pr')
  .description('Generate and open a PR based on recent commits')
  .action(runPRFlow);

program.parse(process.argv);
