import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import os from 'os';
import chalk from 'chalk';

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
  console.log('\n🧠 Let’s set up git-chimp 🐒\n');

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, '../../.env');

  if (fs.existsSync(envPath)) {
    console.log(
      chalk.yellow('⚠️  .env file already exists. Not overwriting.')
    );
    process.exit(1);
  }

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
    console.log(chalk.green(`\n✅ Configuration saved to .env`));
  } catch (err) {
    console.error(chalk.red('❌ Failed to write .env file:'), err);
  }
}
