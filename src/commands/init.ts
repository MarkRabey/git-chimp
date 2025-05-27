import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

export async function handleInit() {
  console.log('\n🧠 Let’s set up commit-chimp 🐒\n');

  const openai = await ask('Enter your OpenAI API key: ');
  const github = await ask(
    'Enter your GitHub Personal Access Token: '
  );
  const repo = await ask(
    'Enter your GitHub repo (e.g. username/repo): '
  );

  rl.close();

  const envVars = [
    `OPENAI_API_KEY=${openai}`,
    `GITHUB_TOKEN=${github}`,
    `GITHUB_REPO=${repo}`,
  ].join(os.EOL);

  try {
    fs.writeFileSync(envPath, envVars + os.EOL);
    console.log(`\n✅ Configuration saved to .env`);
  } catch (err) {
    console.error('❌ Failed to write .env file:', err);
  }
}
