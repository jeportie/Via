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
import path from 'path';

import inquirer from 'inquirer';

import { updateRegistry } from './updateRegistry.js';

import type { QuestionCollection } from 'inquirer';

type OpenApiAnswers = {
  url: string;
  baseUrl: string;
  schemaName: string;
}

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
    }
  ];

  // eslint-disable-next-line import/no-named-as-default-member
  const { url, baseUrl, schemaName } = await inquirer.prompt<OpenApiAnswers>(question);

  const schemaDir = path.resolve('src/schema');
  const fileDir = path.join(schemaDir, `${schemaName}.ts`);

  console.log('\n📥 Generating OpenAPI types...');
  exec(`npx openapi-typescript ${url} -o ${fileDir}`);

  updateRegistry({
    baseUrl,
    schemaName,
    schemaPath: fileDir,
  })

  console.log('\n✨ Done! Registry updated.');
}

