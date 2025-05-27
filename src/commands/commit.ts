import { generateCommitMessages } from '../lib/openai.js';
import { simpleGit } from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';

const git = simpleGit();

export async function handleCommitCommand(options: {
  custom?: boolean;
  message?: boolean;
}) {
  try {
    const diff = await git.diff(['--staged']);

    if (!diff) {
      console.log(chalk.yellow('⚠️ No staged changes found.'));
      return;
    }

    // 1. Custom message flow
    if (options.custom) {
      const { customMessage } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customMessage',
          message: 'Enter your custom commit message:',
          validate: (input: string) =>
            input.length > 0 || 'Message cannot be empty!',
        },
      ]);
      await git.commit(customMessage);
      console.log(chalk.green('✅ Commit created!'));
      return;
    }

    // 2. Non-interactive mode (for piping)
    if (options.message) {
      const messages = await generateCommitMessages(diff);
      const first = messages[0] ?? 'chore: update';

      // Output for piping into git
      console.log(first);
      return;
    }

    // 3. Interactive picker (default flow)
    const messages = await generateCommitMessages(diff);
    messages.push('✏️ Write my own');

    const { selectedMessage } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedMessage',
        message: 'Pick a commit message:',
        choices: messages,
      },
    ]);

    let finalMessage = selectedMessage;

    if (selectedMessage === '✏️ Write my own') {
      const { customMessage } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customMessage',
          message: 'Enter your custom commit message:',
          validate: (input: string) =>
            input.length > 0 || 'Message cannot be empty!',
        },
      ]);
      finalMessage = customMessage;
    }

    await git.commit(finalMessage);
    console.log(chalk.green('✅ Commit created!'));
  } catch (error) {
    console.error(chalk.red('❌ Error creating commit:'), error);
  }
}
