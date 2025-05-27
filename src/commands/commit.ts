import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import { generateCommitMessage } from '../lib/openai.js';

const git = simpleGit();

export async function handleCommit() {
  try {
    const status = await git.status();

    if (status.staged.length === 0) {
      console.log(chalk.red('❌ No staged changes to commit.'));
      return;
    }

    console.log(
      chalk.blue('🔍 Generating commit message with AI...')
    );

    const diff = await git.diff(['--cached']);
    const message = await generateCommitMessage(diff);

    console.log(chalk.green('\n📝 Suggested commit message:'));
    console.log(chalk.cyanBright(`\n  "${message}"\n`));

    await git.commit(message);
    console.log(chalk.green('✅ Commit successful!'));
  } catch (error) {
    console.error(
      chalk.red('🔥 Failed to generate or commit message:'),
      error
    );
    process.exit(1);
  }
}
