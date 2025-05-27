import simpleGit from 'simple-git';
import { Octokit } from '@octokit/rest';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config();
const git = simpleGit();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function runPRFlow() {
  const log = await git.log(['main..HEAD']);
  const commitMessages = log.all
    .map((commit) => `- ${commit.message}`)
    .join('\n');

  const prompt = `Generate a GitHub Pull Request title and description from these commit messages:\n${commitMessages}`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const output = completion.choices[0].message.content;
  console.log('\nSuggested PR content:\n');
  console.log(output);
}
