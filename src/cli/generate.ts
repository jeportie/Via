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
import { fileURLToPath } from 'url';
import { promisify } from 'util';

import inquirer from 'inquirer';

import { ensureRegistryExists } from './registry.js';
import { updateRegistry } from './updateRegistry.js';

import type { QuestionCollection } from 'inquirer';

const execAsync = promisify(exec);

// Get the directory where this CLI file is located
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);

/**
 * Find the openapi-typescript binary relative to Via's installation
 * CLI is at: node_modules/@jeportie/via/dist/mjs/cli/generate.js
 * openapi-typescript could be at:
 * 1. node_modules/@jeportie/via/node_modules/openapi-typescript/bin/cli.js
 * 2. node_modules/openapi-typescript/bin/cli.js (if hoisted by pnpm/npm)
 */
function findOpenApiTypescriptBin(): string {
  const viaRoot = path.resolve(__dirname, '../../..'); // Points to @jeportie/via root

  const possiblePaths = [
    // In Via's own node_modules
    path.join(viaRoot, 'node_modules/openapi-typescript/bin/cli.js'),
    // Hoisted to parent node_modules (common with pnpm/npm workspaces)
    path.join(viaRoot, '../openapi-typescript/bin/cli.js'),
  ];

  for (const binPath of possiblePaths) {
    if (fs.existsSync(binPath)) {
      return binPath;
    }
  }

  throw new Error(
    'Could not find openapi-typescript binary. This is a bug in @jeportie/via. ' +
      `Searched paths: ${possiblePaths.join(', ')}`,
  );
}

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

  // eslint-disable-next-line import/no-named-as-default-member
  const { url, baseUrl, schemaName } =
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
    const openApiTypescriptBin = findOpenApiTypescriptBin();

    await execAsync(`node "${openApiTypescriptBin}" "${url}" -o "${fileDir}"`);
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
