#!/usr/bin/env node

import inquirer from 'inquirer';

import { generateFromOpenApi } from './generate.js';
import { ensureRegistryExists } from './registry.js';

import type { QuestionCollection } from 'inquirer';

console.log('\n🚀 Via — Typed Fetch API Registry Generator\n');

type ModeAnswer = {
  mode: 'openapi' | 'manual';
};

const questions: QuestionCollection = [
  {
    type: 'list',
    name: 'mode',
    message: 'Choose Generation Mode:',
    choices: [
      { name: 'OpenAPI (generate schema + registry)', value: 'openapi' },
      { name: 'Manual (manage schema yourself)', value: 'manual' },
    ],
  },
];

async function main(): Promise<void> {
  // eslint-disable-next-line import/no-named-as-default-member
  const { mode } = await inquirer.prompt<ModeAnswer>(questions);

  if (mode === 'openapi') {
    await generateFromOpenApi();
  } else {
    console.log('✋ Manual mode selected.');
    console.log('👉 Creating registry file...');
    ensureRegistryExists();
    console.log(
      '👉 You can now add schemas and edit src/apiRegistry.ts manually.',
    );
  }
}

main().catch((err) => {
  console.error('❌ CLI error');
  console.error(err);
  process.exit(1);
});
