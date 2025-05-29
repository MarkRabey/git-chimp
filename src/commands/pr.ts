import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import { Octokit } from '@octokit/rest';
import { generatePullRequestDescription } from '../lib/openai.js';
import readline from 'readline';

function askUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function handlePR() {
  const shouldAutoUpdate = process.argv.includes('--update');

  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    console.error(
      chalk.red(
        '❌ Missing GITHUB_TOKEN or GITHUB_REPO in environment variables.'
      )
    );
    process.exit(1);
  }

  const git = simpleGit();
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const currentBranch = (await git.branch()).current;

    console.log(
      chalk.blue(
        `📦 Preparing PR for branch: ${chalk.bold(currentBranch)}`
      )
    );
    console.log(
      chalk.blue('🔍 Generating pull request description with AI...')
    );

    const diff = await git.diff(['main', currentBranch]);
    const description = await generatePullRequestDescription(diff);

    let owner, repo;

    if (process.env.GITHUB_REPO) {
      [owner, repo] = process.env.GITHUB_REPO.split('/');
    } else {
      const remotes = await git.getRemotes(true);
      const originRemote = remotes.find((r) => r.name === 'origin');

      if (!originRemote || !originRemote.refs.fetch) {
        console.error(
          chalk.red(
            '❌ Could not determine the GitHub repository from the remote.'
          )
        );
        process.exit(1);
      }

      const repoUrl = originRemote.refs.fetch;

      // Extract owner/repo from URLs like:
      // - git@github.com:owner/repo.git
      // - https://github.com/owner/repo.git
      const match = repoUrl.match(
        /github\.com[/:](.+?)\/(.+?)(\.git)?$/
      );

      if (!match) {
        console.error(
          chalk.red(
            `❌ Failed to parse GitHub repo from remote URL: ${repoUrl}`
          )
        );
        process.exit(1);
      }

      [, owner, repo] = match;
    }

    const existingPRs = await octokit.rest.pulls.list({
      owner,
      repo,
      head: `${owner}:${currentBranch}`,
      state: 'open',
    });

    const existingPR = existingPRs.data[0];

    if (existingPR) {
      console.log(
        chalk.yellow(
          `⚠️ A pull request already exists: ${chalk.underline(existingPR.html_url)}`
        )
      );

      if (shouldAutoUpdate) {
        console.log(chalk.blue('🔁 Updating existing PR...'));
        await octokit.rest.pulls.update({
          owner,
          repo,
          pull_number: existingPR.number,
          body: description,
        });
        console.log(chalk.green('✅ PR updated successfully.'));
      } else {
        const answer = await askUser(
          'Do you want to update the existing PR? (y/N): '
        );
        if (answer === 'y' || answer === 'yes') {
          await octokit.rest.pulls.update({
            owner,
            repo,
            pull_number: existingPR.number,
            body: description,
          });
          console.log(chalk.green('✅ PR updated successfully.'));
        } else {
          console.log(chalk.gray('🚫 PR update canceled.'));
        }
      }
    } else {
      const pr = await octokit.rest.pulls.create({
        owner,
        repo,
        title: `🚀 ${currentBranch}`,
        head: currentBranch,
        base: 'main',
        body: description,
      });

      console.log(
        chalk.green(
          `✅ PR created: ${chalk.underline.blue(pr.data.html_url)}`
        )
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(chalk.red('🔥 Failed to handle PR:'), error);
    process.exit(1);
  }
}
