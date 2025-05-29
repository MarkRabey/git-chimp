import fs from 'node:fs/promises';
import path from 'node:path';

const CONFIG_FILE = path.resolve('.git-chimprc'); // no .json

export async function loadConfig(): Promise<Record<string, any>> {
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
