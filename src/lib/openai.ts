import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const OPENAI_MODEL = 'gpt-3.5-turbo';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateCommitMessages(
  diff: string,
  count = 3
): Promise<string[]> {
  const prompt = `
You are a helpful assistant that writes concise, conventional commit messages based on Git diffs.

Here is the diff:
${diff}

Respond with ${count} different commit message options, each on its own line.
Messages should be short, use present tense, and follow conventional commit style.
  `;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = completion.choices[0].message.content?.trim() || '';
  const lines = raw.split('\n').filter((line) => line.trim() !== '');
  return lines.slice(0, count); // Just in case the model got a little too chatty
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
