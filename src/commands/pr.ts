import { simpleGit } from 'simple-git';
import * as dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // e.g. "user/repo"

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.error(
    '❌ Missing GITHUB_TOKEN or GITHUB_REPO in environment variables.'
  );
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function handlePR() {
  const git = simpleGit();

  try {
    const status = await git.status();
    const currentBranch = status.current;

    if (!currentBranch) {
      console.error('❌ Could not determine current Git branch.');
      process.exit(1);
    }

    const commits = await git.log({ n: 5 });
    const commitMessages = commits.all
      .map((c) => `- ${c.message}`)
      .join('\n');

    const title =
      commits.latest?.message || `Update from ${currentBranch}`;
    const body = `### Changes:\n\n${commitMessages}`;

    const [owner, repo] = GITHUB_REPO?.split('/') || [];

    const { data: pr } = await octokit.rest.pulls.create({
      owner,
      repo,
      head: currentBranch,
      base: 'main', // or 'develop' or configurable later
      title,
      body,
    });

    console.log(`✅ PR created: ${pr.html_url}`);
  } catch (err) {
    console.error('❌ Failed to create PR:', err);
    process.exit(1);
  }
}
