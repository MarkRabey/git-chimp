import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const OPENAI_MODEL = 'gpt-3.5-turbo';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCommitMessage(
  diff: string
): Promise<string> {
  const prompt = `
You are a helpful assistant that writes concise, conventional commit messages based on Git diffs.

Here is the diff:
${diff}

Respond with a single commit message in present tense, without quotation marks.
  `;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
  });

  return (
    completion.choices[0].message.content?.trim() ||
    'chore: update code'
  );
}

export async function generatePullRequestDescription(
  diff: string
): Promise<string> {
  const prompt = `
You are a helpful assistant that writes professional pull request descriptions based on Git diffs.

Here is the diff:
${diff}

Include a brief summary of the changes, mention any important context, and highlight anything reviewers should pay attention to. Use markdown formatting and keep it concise.
  `;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
  });

  return (
    completion.choices[0].message.content?.trim() ||
    'This PR contains general updates and improvements.'
  );
}
