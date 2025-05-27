import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import { Octokit } from '@octokit/rest';
import { generatePullRequestDescription } from '../lib/openai.js';

export async function handlePR() {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    console.error(
      chalk.red(
        '❌ Missing GITHUB_TOKEN or GITHUB_REPO in environment variables.'
      )
    );
    return;
  }

  const git = simpleGit();
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const currentBranch = (await git.branch()).current;

    console.log(
      chalk.blue(
        `📦 Creating PR for branch: ${chalk.bold(currentBranch)}`
      )
    );
    console.log(
      chalk.blue('🔍 Generating pull request description with AI...')
    );

    const diff = await git.diff(['main', currentBranch]);
    const description = await generatePullRequestDescription(diff);

    const [owner, repo] = process.env.GITHUB_REPO.split('/');

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
  } catch (error) {
    console.error(chalk.red('🔥 Failed to create PR:'), error);
  }
}
