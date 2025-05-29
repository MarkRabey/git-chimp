import { generateCommitMessages } from '../lib/openai.js';
import { simpleGit } from 'simple-git';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { cleanCommitMessages } from '../utils/format.js';
import { ChimpConfig, loadConfig } from '../utils/config.js';

const git = simpleGit();

export async function handleCommitCommand(
  cliOptions?: Partial<ChimpConfig> & {
    custom?: boolean;
    message?: boolean;
  }
) {
  const fileConfig = await loadConfig();
  const config: ChimpConfig = {
    ...fileConfig,
    ...cliOptions,
  };

  const useCustomMessage = cliOptions?.custom || false;
  const messageMode = cliOptions?.message || false;

  try {
    const diff = await git.diff(['--staged']);

    if (!diff) {
      console.log(chalk.yellow('⚠️ No staged changes found.'));
      process.exit(0);
    }

    // 1. Custom message flow
    if (useCustomMessage) {
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
    if (messageMode) {
      const messages = await generateCommitMessages(
        diff,
        3,
        config.tone
      );
      const first = messages[0] ?? 'chore: update';

      // Output for piping into git
      console.log(first);
      return;
    }

    // 3. Interactive picker (default flow)
    const rawSuggestions = await generateCommitMessages(diff);
    const messages = cleanCommitMessages(rawSuggestions);
    messages.push('✏️ Write my own');

    const { selectedMessage } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedMessage',
        message: 'Pick a commit message:',
        choices: messages.map((msg, index) => ({
          name: `${index + 1}. ${msg}`,
          value: msg,
        })),
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
