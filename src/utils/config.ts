import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';

export type ChimpConfig = {
  enforceSemanticPrTitles?: boolean;
  model?: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' | 'gpt-4o-mini';
  prMode?: 'open' | 'draft' | 'display';
  tone?:
    | 'neutral'
    | 'friendly'
    | 'sarcastic'
    | 'enthusiastic'
    | string;
};

const CONFIG_FILE = path.resolve('.git-chimprc'); // no .json

export async function loadConfig(): Promise<ChimpConfig> {
  try {
    const str = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(str);
  } catch {
    return {};
  }
}

export async function saveConfig(obj: Record<string, any>) {
  await fs.writeFile(
    CONFIG_FILE,
    JSON.stringify(obj, null, 2) + '\n'
  );
}

export function isSemanticPrTitle(title: string): boolean {
  return /^(feat|fix|chore|docs|style|refactor|perf|test)(\(.*\))?: .+/.test(
    title
  );
}

export function validatePrTitle(
  title: string,
  config: ChimpConfig,
  opts: { throwOnError?: boolean } = {}
): boolean {
  const isValid = isSemanticPrTitle(title);

  if (!isValid && config.enforceSemanticPrTitles) {
    const msg = `❌ PR title "${title}" is not semantic. Expected something like "feat: Add login support"`;
    if (opts.throwOnError) {
      throw new Error(msg);
    } else {
      console.warn(chalk.yellow(msg));
    }
  }

  return isValid;
}
