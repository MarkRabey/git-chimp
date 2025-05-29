import chalk from 'chalk';
import { loadConfig, saveConfig } from '../utils/config.js';

export async function handleConfig(cmd: {
  get?: string;
  set?: string;
  value?: string;
  list?: boolean;
}) {
  const cfg = await loadConfig();

  if (cmd.list) {
    console.log(chalk.blueBright(JSON.stringify(cfg, null, 2)));
    process.exit(0);
  }

  if (cmd.get) {
    console.log(cfg[cmd.get] ?? chalk.yellow('(undefined)'));
    process.exit(0);
  }

  if (cmd.set && cmd.value !== undefined) {
    cfg[cmd.set] = cmd.value;
    await saveConfig(cfg);
    console.log(chalk.green(`✅ ${cmd.set} set to "${cmd.value}"`));
    process.exit(0);
  }

  console.log(
    chalk.red('No action specified – use --list, --get, or --set')
  );
  process.exit(1);
}
