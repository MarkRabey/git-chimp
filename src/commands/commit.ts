import { simpleGit } from 'simple-git';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config();
const git = simpleGit();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleCommit() {
  const diff = await git.diff(['--cached']);
  if (!diff) {
    console.log('No staged changes found.');
    return;
  }

  const prompt = `Summarize the following git diff into a useful commit message:\n\n${diff}`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const suggestion =
    completion.choices[0].message.content?.trim() || 'chore: update';
  console.log(`Suggested commit message:\n${suggestion}`);
}
