// ************************************************************************** //
//                                                                            //
//                                                                            //
//   generate_sdk.ts                                                          //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/19 17:32:00 by jeportie                                 //
//   Updated: 2026/01/19 17:32:19 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import { Project, Node } from "ts-morph";
import path from "path";
import fs from "fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const methods: Record<HttpMethod, "get" | "post" | "put" | "delete"> = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractJsDocText(decl: Node): string {
  if (!Node.isJSDocable(decl)) return "";

  const lines: string[] = [];

  for (const doc of decl.getJsDocs()) {
    const comment = doc.getComment();
    if (typeof comment === "string" && comment.trim()) {
      lines.push(comment.trim());
    }

    for (const tag of doc.getTags()) {
      const tagComment = tag.getComment();
      lines.push(
        "@" + tag.getTagName() + (tagComment ? " " + tagComment : "")
      );
    }
  }

  return lines.join("\n");
}

function toCamelCase(name: string) {
  return name
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9_]/g, "");
}

function parseRoute(route: string) {
  // /api/auth/activate/{token} → /api/auth/activate
  const cleaned = route.replace(/\/\{[^}]+\}/g, "");
  const parts = cleaned.split("/").filter(Boolean);

  // /api/<group>/<name>
  if (parts[0] === "api" && parts.length >= 3) {
    return {
      group: parts[1],
      name: toCamelCase(parts[2]),
    };
  }

  // /metrics
  if (parts.length === 1) {
    return {
      group: "_root",
      name: toCamelCase(parts[0]),
    };
  }

  throw new Error(`Unsupported route format: ${route}`);
}

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const apiSchema = project.getSourceFileOrThrow("apiSchema.ts");
const paths = apiSchema.getInterfaceOrThrow("paths");

// ---------------------------------------------------------------------------
// Collect endpoints
// ---------------------------------------------------------------------------

type Endpoint = {
  route: string;
  group: string;
  name: string;
  jsdoc: string;
};

const collected: Record<HttpMethod, Record<string, Endpoint[]>> = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

for (const prop of paths.getProperties()) {
  const route = prop.getName().replace(/^"|"$/g, "");
  const routeType = prop.getType();
  const { group, name } = parseRoute(route);

  for (const [METHOD, key] of Object.entries(methods) as [
    HttpMethod,
    (typeof methods)[HttpMethod]
  ][]) {
    const symbol = routeType.getProperty(key);
    if (!symbol) continue;

    const decl = symbol.getValueDeclaration();
    if (!decl) continue;

    if (decl.getType().getNonNullableType().isNever()) continue;

    const jsdoc = extractJsDocText(decl);

    collected[METHOD][group] ??= [];
    collected[METHOD][group].push({ route, group, name, jsdoc });
  }
}

// ---------------------------------------------------------------------------
// Emit files
// ---------------------------------------------------------------------------

const outDir = path.join("src", "generated");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// Generate per-method group classes (GENERIC ON <S>)
// ---------------------------------------------------------------------------

for (const METHOD of Object.keys(collected) as HttpMethod[]) {
  for (const [group, endpoints] of Object.entries(collected[METHOD])) {
    const fileName = `${METHOD.toLowerCase()}.${group}.ts`;
    const filePath = path.join(outDir, fileName);

    const className =
      group === "_root"
        ? `${METHOD}Api`
        : `${group[0].toUpperCase()}${group.slice(1)}${METHOD}Api`;

    const lines: string[] = [];

    lines.push(
      `import FetchClient from "../FetchClient";`,
      `import { ApiBody, ApiReturn } from "../types";`,
      ``,
      `export class ${className}<S> {`,
      `  constructor(private client: FetchClient) {}`,
      ``
    );

    for (const ep of endpoints) {
      if (ep.jsdoc) {
        lines.push(
          `  /**`,
          ...ep.jsdoc.split("\n").map(l => `   * ${l}`),
          `   */`
        );
      }

      const hasBody = METHOD !== "GET" && METHOD !== "DELETE";

      const params = hasBody
        ? `body: ApiBody<S, "${ep.route}", "${METHOD}">`
        : "";

      const callArgs = hasBody
        ? `"${ep.route}", "${METHOD}", body`
        : `"${ep.route}", "${METHOD}"`;

      lines.push(
        `  ${ep.name}(${params}) {`,
        `    return this.client.request<ApiReturn<S, "${ep.route}", "${METHOD}">>(${callArgs});`,
        `  }`,
        ``
      );
    }

    lines.push(`}`);
    fs.writeFileSync(filePath, lines.join("\n"));
  }
}

// ---------------------------------------------------------------------------
// Generate index.ts → FetchApi<S>
// ---------------------------------------------------------------------------

const indexLines: string[] = [
  `import FetchClient from "../FetchClient";`,
];

// imports
for (const METHOD of Object.keys(collected) as HttpMethod[]) {
  for (const group of Object.keys(collected[METHOD])) {
    const className =
      group === "_root"
        ? `${METHOD}Api`
        : `${group[0].toUpperCase()}${group.slice(1)}${METHOD}Api`;

    indexLines.push(
      `import { ${className} } from "./${METHOD.toLowerCase()}.${group}";`
    );
  }
}

indexLines.push("");

// FetchApi<S>
indexLines.push(
  `export class FetchApi<S> {`,
  `  readonly get: {`
);

for (const group of Object.keys(collected.GET)) {
  const cls =
    group === "_root" ? "GETApi" : `${group[0].toUpperCase()}${group.slice(1)}GETApi`;
  indexLines.push(`    ${group}: ${cls}<S>;`);
}

indexLines.push(
  `  };`,
  `  readonly post: {`
);

for (const group of Object.keys(collected.POST)) {
  const cls = `${group[0].toUpperCase()}${group.slice(1)}POSTApi`;
  indexLines.push(`    ${group}: ${cls}<S>;`);
}

indexLines.push(
  `  };`,
  ``,
  `  constructor(baseUrl: string) {`,
  `    const client = new FetchClient(baseUrl);`,
  ``,
  `    this.get = {`
);

for (const group of Object.keys(collected.GET)) {
  const cls =
    group === "_root" ? "GETApi" : `${group[0].toUpperCase()}${group.slice(1)}GETApi`;
  indexLines.push(`      ${group}: new ${cls}<S>(client),`);
}

indexLines.push(
  `    };`,
  ``,
  `    this.post = {`
);

for (const group of Object.keys(collected.POST)) {
  const cls = `${group[0].toUpperCase()}${group.slice(1)}POSTApi`;
  indexLines.push(`      ${group}: new ${cls}<S>(client),`);
}

indexLines.push(
  `    };`,
  `  }`,
  `}`
);

fs.writeFileSync(path.join(outDir, "index.ts"), indexLines.join("\n"));

console.log("✅ SDK generated successfully");
