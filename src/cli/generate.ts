// ************************************************************************** //
//                                                                            //
//                                                                            //
//   generate.ts                                                              //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/20 15:45:37 by jeportie                                 //
//   Updated: 2026/01/20 15:46:42 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import inquirer from 'inquirer';

import { ensureRegistryExists } from './registry.js';
import { updateRegistry } from './updateRegistry.js';

import type { QuestionCollection } from 'inquirer';

const execAsync = promisify(exec);

type OpenApiAnswers = {
  url: string;
  baseUrl: string;
  schemaName: string;
};

export async function generateFromOpenApi(): Promise<void> {
  const question: QuestionCollection = [
    {
      type: 'input',
      name: 'url',
      message: 'OpenApi JSON URL:',
      validate: (resp: string) => resp.startsWith('http'),
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Base API URL (used at runtime):',
      validate: (resp: string) => resp.startsWith('http'),
    },
    {
      type: 'input',
      name: 'schemaName',
      message: 'Schema name:',
      default: 'openapi-types',
    },
  ];

  const { url, baseUrl, schemaName } =
    // eslint-disable-next-line import/no-named-as-default-member
    await inquirer.prompt<OpenApiAnswers>(question);

  // Now that all prompts are done, create the registry file
  ensureRegistryExists();

  const schemaDir = path.resolve('src/schema');
  const fileDir = path.join(schemaDir, `${schemaName}.ts`);

  // Create schema directory if it doesn't exist
  if (!fs.existsSync(schemaDir)) {
    fs.mkdirSync(schemaDir, { recursive: true });
    console.log(`✅ Created directory: ${schemaDir}`);
  }

  console.log('\n📥 Generating OpenAPI types...');

  try {
    await execAsync(`npx openapi-typescript "${url}" -o "${fileDir}"`);
    console.log(`✅ Schema generated: ${fileDir}`);

    updateRegistry({
      baseUrl,
      schemaName,
      schemaPath: fileDir,
    });

    console.log('\n✨ Done! Registry updated.');
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI types:');
    console.error(error instanceof Error ? error.message : String(error));
    throw error;
  }
}
