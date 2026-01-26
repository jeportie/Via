// ************************************************************************** //
//                                                                            //
//                                                                            //
//   updateRegistry.ts                                                        //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/20 15:36:33 by jeportie                                 //
//   Updated: 2026/01/20 15:45:31 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import fs from 'fs';
import path from 'path';

interface RegistryEntry {
  baseUrl: string;
  schemaName: string;
  schemaPath: string;
}

const REGISTRY_PATH = path.resolve('src/apiRegistry.ts');

export function updateRegistry(entry: RegistryEntry): void {
  let content = fs.readFileSync(REGISTRY_PATH, 'utf8');

  if (content.includes(`"${entry.baseUrl}"`)) {
    console.log('⚠️ Base URL already exists in registry, skipping.');

    return;
  }

  const importLine = `import type { paths as ${entry.schemaName} } from './schema/${entry.schemaName}.js';\n`;

  if (!content.includes(importLine)) {
    const lines = content.split('\n');

    let insertIndex = 0;

    while (insertIndex < lines.length && (lines[insertIndex]?.startsWith('//') || lines[insertIndex]?.trim() === '')) {
      insertIndex++;
    }

    lines.splice(insertIndex, 0, importLine.trim(), '');

    content = lines.join('\n');
  }
  content = content.replace(/export interface ApiRegistry\s*{([\s\S]*?)}/, (_m, body) => {
    return `export interface ApiRegistry {\n  '${entry.baseUrl}': ${entry.schemaName};${body}\n}`;
  });

  fs.writeFileSync(REGISTRY_PATH, content, 'utf8');
}
