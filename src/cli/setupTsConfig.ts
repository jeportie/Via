// ************************************************************************** //
//                                                                            //
//                                                                            //
//   setupTsConfig.ts                                                         //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/29 19:13:47 by jeportie                                 //
//   Updated: 2026/01/29 19:37:18 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import fs from 'fs';
import path from 'path';

import inquirer from 'inquirer';

import type { QuestionCollection } from 'inquirer';

const TS_CONFIG_PATH = path.resolve('tsconfig.json');
const VIA_SETUP_PATH = 'src/via.setup.ts';
const DEFAULT_TSCONFIG = {
  compilerOptions: {
    moduleResolution: 'NodeNext',
    module: 'ESNEXT',
    target: 'ES2022',
  },
  files: [VIA_SETUP_PATH],
  include: ['**/*.ts'],
};

export async function manageTsConfig(): Promise<void> {
  const question: QuestionCollection = [
    {
      type: 'confirm',
      name: 'config',
      message: 'Create a minimal tsconfig.json now?',
    },
  ];

  if (!fs.existsSync(TS_CONFIG_PATH)) {
    console.log('❌ No tsconfig.json found.');
    console.log('Via requires a TypeScript project.');
    // eslint-disable-next-line import/no-named-as-default-member
    const { config } = await inquirer.prompt(question);

    if (config) {
      fs.writeFileSync(
        TS_CONFIG_PATH,
        JSON.stringify(DEFAULT_TSCONFIG, null, 2),
        'utf8',
      );
      console.log('✅ Created tsconfig.json with Via setup.');
    }

    return;
  }

  const raw = fs.readFileSync(TS_CONFIG_PATH, 'utf8');
  const tsconf = JSON.parse(raw) as Record<string, unknown>;
  let changed = false;

  if (!Array.isArray(tsconf.files) || !tsconf.files.includes(VIA_SETUP_PATH)) {
    tsconf.files = [VIA_SETUP_PATH];
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(TS_CONFIG_PATH, JSON.stringify(tsconf, null, 2), 'utf8');
    console.log('✅ Updated tsconfig.json with Via setup.');
  } else {
    console.log('ℹ️ tsconf.json already configured for Via.');
  }
}
