import { generateCommitMessages } from '../lib/openai.js';
import { simpleGit } from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';

const git = simpleGit();

export async function handleCommitCommand() {
  try {
    const diff = await git.diff(['--staged']);

    if (!diff) {
      console.log(
        chalk.yellow(
          '⚠️ No staged changes found. Stage files before running this command.'
        )
      );
      return;
    }

    const messages = await generateCommitMessages(diff);

    const { selectedMessage } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedMessage',
        message: 'Pick a commit message:',
        choices: messages,
      },
    ]);

    await git.commit(selectedMessage);
    console.log(chalk.green('✅ Commit created!'));
  } catch (error) {
    console.error(
      chalk.red('❌ Error generating or committing message:'),
      error
    );
  }
}
