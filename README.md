# Via

> Type-safe fetch wrapper for TypeScript. Zero config, maximum DX.

[![npm version](https://img.shields.io/npm/v/@jeportie/via.svg)](https://www.npmjs.com/package/@jeportie/via) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

**Via** is a lightweight, composable fetch wrapper that brings compile-time type safety to your REST API clients. Generate TypeScript types from OpenAPI schemas, get full IntelliSense, and catch errors before runtime.

## ✨ Key Features

- **🔒 Type-Safe by Default** — Full TypeScript inference from OpenAPI schemas
- **🎯 Zero Boilerplate** — Generate types with one CLI command
- **🧩 Composable** — Works as typed client OR untyped fetch wrapper
- **📦 Dual Build** — CommonJS + ESM support out of the box
- **🎨 Excellent DX** — Autocomplete for routes, methods, and payloads
- **⚡ Lightweight** — Minimal dependencies, maximum performance

```typescript
import { Via } from '@jeportie/via';

// Full type safety and autocomplete
const api = new Via('https://petstore3.swagger.io');

// TypeScript knows the exact shape of request and response
const pet = await api.post('/pet', {
  name: 'Rex',
  photoUrls: [],
});
// ^? Pet type inferred from OpenAPI schema
```

---

## 📚 Table of Contents

- [Why Via?](#-why-via)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Features](#-features)
- [Usage](#-usage)
  - [Generating Schemas](#1-generate-types-from-openapi)
  - [Creating Clients](#2-create-api-client)
  - [Making Requests](#3-make-type-safe-requests)
- [CLI Reference](#-cli-reference)
- [Architecture](#-architecture)
- [Comparison](#-comparison-with-alternatives)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🤔 Why Via?

### The Problem

Manual API client code is tedious and error-prone:

- Writing types by hand for every endpoint
- No autocomplete for routes or payloads
- Runtime errors from typos or schema changes
- Boilerplate code for every HTTP method

### The Solution

Via auto-generates TypeScript types from OpenAPI schemas:

- **Design-time safety**: Catch errors in your IDE, not production
- **Self-documenting**: Types ARE the documentation
- **Change-proof**: Schema updates automatically flow to your code
- **Developer joy**: Full IntelliSense for every endpoint

### The Benefits

- 🎯 **Accuracy**: Impossible to call wrong endpoints or send bad payloads
- ⚡ **Speed**: No manual type definitions, just generate and go
- 🛡️ **Reliability**: Type errors caught at compile time, not runtime
- 🧘 **Peace of Mind**: Refactoring is safe, schema changes are obvious

---

## 🚀 Quick Start

Get up and running in 60 seconds:

### 1. Install Via

```bash
npm install @jeportie/via
```

### 2. Generate Types from Your API

```bash
npx via
```

The CLI will prompt you for:

- **OpenAPI URL**: Where to fetch your schema (e.g., `https://api.example.com/openapi.json`)
- **Base URL**: Your API's base URL (e.g., `https://api.example.com`)
- **Schema Name**: A name for the generated types (e.g., `myApiSchema`)

This generates:

```
src/
├── schema/
│   └── myApiSchema.ts      # Generated TypeScript types
└── apiRegistry.ts          # Base URL → Schema mapping
```

### 3. Create a Client and Make Requests

```typescript
import { Via } from '@jeportie/via';

// Initialize client with your base URL
const api = new Via('https://api.example.com');

// TypeScript now knows ALL your endpoints
const users = await api.get('/users');
//    ^? User[] type inferred from schema

// Request bodies are type-checked too
await api.post('/users', {
  name: 'Alice',
  email: 'alice@example.com',
  // TypeScript errors if fields don't match schema
});
```

---

## 📦 Installation

```bash
# npm
npm install @jeportie/via

# pnpm
pnpm add @jeportie/via

# yarn
yarn add @jeportie/via
```

### Requirements

- Node.js 18+ (for CLI)
- TypeScript 5.0+ (for type inference)

---

## ✅ Features

### Current (v0.x)

- ✅ **Type-Safe REST Client** — Full TypeScript inference for GET, POST, PUT, DELETE
- ✅ **OpenAPI Integration** — Generate types from OpenAPI 3.x specifications
- ✅ **API Registry** — Map base URLs to TypeScript schemas
- ✅ **Interactive CLI** — Guided schema generation workflow
- ✅ **Dual Module Support** — Works in CommonJS and ESM projects
- ✅ **Zero Config** — Works out of the box with sensible defaults

### 🚧 Coming in v1.0

- 🚧 **Untyped Fallback Mode** — Use as fetch wrapper for non-registered APIs
- 🚧 **Query Parameters** — Type-safe URL query strings
- 🚧 **Path Parameters** — Automatic substitution of `{id}` style params
- 🚧 **Enhanced Error Handling** — Typed error responses for 4xx/5xx status codes
- 🚧 **Authentication Helpers** — Built-in support for Bearer tokens and API keys
- 🚧 **Request Interceptors** — Middleware for custom headers, logging, etc.

### 🔮 Future (v1.1+)

- 🔮 **SDK Generation** — Optional grouped method style (`api.get.users.listAll()`)
- 🔮 **Watch Mode** — Auto-regenerate types when OpenAPI schema changes
- 🔮 **JSDoc Preservation** — Extract and display API documentation in IDE
- 🔮 **Multi-Status Types** — Type different response codes (200, 201, etc.)
- 🔮 **Plugin System** — Custom middleware and transformers
- 🔮 **Framework Integrations** — React hooks, Vue composables

---

## 📖 Usage

### 1. Generate Types from OpenAPI

Via includes an interactive CLI for schema generation:

```bash
npx via
```

**CLI Workflow:**

1. **Choose Mode**: OpenAPI (auto-generate) or Manual (DIY)
2. **OpenAPI URL**: Where to fetch your schema
3. **Base URL**: Runtime API base URL
4. **Schema Name**: Identifier for generated types

**Example:**

```
🚀 Via — Typed Fetch API Registry Generator

? Choose Generation Mode: OpenAPI (generate schema + registry)
? Enter the OpenAPI URL: https://petstore3.swagger.io/api/v3/openapi.json
? Enter your API base URL: https://petstore3.swagger.io/api/v3
? Enter schema name: petstoreSchema

✅ Schema generated at: src/schema/petstoreSchema.ts
✅ Registry updated at: src/apiRegistry.ts
```

**Generated Files:**

```typescript
// src/schema/petstoreSchema.ts
export interface paths {
  '/pet': {
    post: operations['addPet'];
    put: operations['updatePet'];
  };
  '/pet/{petId}': {
    get: operations['getPetById'];
    delete: operations['deletePet'];
  };
  // ... full schema types
}

// src/apiRegistry.ts
import type { paths as petstoreSchema } from './schema/petstoreSchema.js';

export interface ApiRegistry {
  'https://petstore3.swagger.io/api/v3': petstoreSchema;
}
```

### 2. Create API Client

```typescript
import { Via } from '@jeportie/via';

// Base URL must be registered in ApiRegistry
const api = new Via('https://petstore3.swagger.io/api/v3');

// TypeScript enforces the constraint at compile time
const invalid = new Via('https://unknown-api.com');
//    ^ Error: Argument not assignable to parameter
```

### 3. Make Type-Safe Requests

#### GET Requests

```typescript
// TypeScript knows which endpoints support GET
const pet = await api.get('/pet/123');
//    ^? Pet type from schema

// Invalid endpoints won't compile
const invalid = await api.get('/nonexistent');
//    ^ Error: Argument not assignable
```

#### POST Requests

```typescript
// Request body is type-checked
const newPet = await api.post('/pet', {
  name: 'Rex',
  photoUrls: [],
  status: 'available',
});

// Missing or wrong fields = compile error
const invalid = await api.post('/pet', {
  name: 'Rex',
  // ^ Error: Missing required field 'photoUrls'
});
```

#### PUT Requests

```typescript
// Update existing resource
const updated = await api.put('/pet', {
  id: 123,
  name: 'Max',
  photoUrls: [],
  status: 'sold',
});
```

#### DELETE Requests

```typescript
// Delete resource
await api.delete('/pet/123');
```

---

## 🛠️ CLI Reference

### `via` (Interactive Mode)

Launch interactive schema generator:

```bash
npx via
```

**Options:**

- **OpenAPI Mode**: Auto-generate from OpenAPI URL
- **Manual Mode**: Manage schemas yourself

### Manual Schema Management

If you prefer manual control:

1. Generate types with `openapi-typescript`:

   ```bash
   npx openapi-typescript https://api.example.com/openapi.json -o src/schema/mySchema.ts
   ```

2. Update `src/apiRegistry.ts`:

   ```typescript
   import type { paths as mySchema } from './schema/mySchema.js';

   export interface ApiRegistry {
     'https://api.example.com': mySchema;
   }
   ```

---

## 🏗️ Architecture

Via's type system uses advanced TypeScript features to extract types from OpenAPI schemas:

### Core Components

#### 1. API Registry (`src/apiRegistry.ts`)

Maps runtime base URLs to compile-time schemas:

```typescript
export interface ApiRegistry {
  'https://api.example.com': apiSchema;
  'https://api2.example.com': api2Schema;
}
```

This is the single source of truth for available APIs.

#### 2. Type System (`src/types.ts`)

Advanced type utilities that traverse OpenAPI structures:

- **`FilterRoutes<Schema, Method>`** — Filters endpoints by HTTP method
- **`ApiBody<Schema, Endpoint, Method>`** — Extracts request body type
- **`ApiReturn<Schema, Endpoint, Method>`** — Extracts response type
- **`ApiParams<Schema, Endpoint, Method>`** — Extracts query/path parameters

**How it works:**

```typescript
// Given OpenAPI structure:
paths: {
  '/users': {
    post: {
      requestBody: { content: { 'application/json': CreateUserDto } }
      responses: { 200: { content: { 'application/json': User } } }
    }
  }
}

// Via extracts:
ApiBody<Schema, '/users', 'POST'> = CreateUserDto
ApiReturn<Schema, '/users', 'POST'> = User
```

#### 3. FetchApi Client (`src/FetchApi.ts`)

Generic client class with method-specific type constraints:

```typescript
class FetchApi<D extends keyof ApiRegistry> {
  constructor(baseUrl: D)

  // Each method only accepts compatible endpoints
  get<E extends FilterRoutes<ApiRegistry[D], 'GET'>>(endpoint: E)
  post<E extends FilterRoutes<ApiRegistry[D], 'POST'>>(endpoint: E, body: ApiBody<...>)
  put<E extends FilterRoutes<ApiRegistry[D], 'PUT'>>(endpoint: E, body: ApiBody<...>)
  delete<E extends FilterRoutes<ApiRegistry[D], 'DELETE'>>(endpoint: E)
}
```

### Type Flow Diagram

```
OpenAPI Schema (runtime)
        ↓
openapi-typescript (CLI)
        ↓
TypeScript Types (src/schema/*.ts)
        ↓
API Registry (compile-time mapping)
        ↓
Via Client (type-safe methods)
        ↓
Your Code (full IntelliSense)
```

---

## 🔍 Comparison with Alternatives

| Feature                  | Via     | openapi-fetch | axios     | native fetch |
| ------------------------ | ------- | ------------- | --------- | ------------ |
| **Type Safety**          | ✅ Full | ✅ Full       | ❌ Manual | ❌ Manual    |
| **OpenAPI Integration**  | ✅ CLI  | ⚠️ DIY        | ❌ None   | ❌ None      |
| **Bundle Size**          | 🟢 Tiny | 🟢 Tiny       | 🔴 Large  | 🟢 None      |
| **Zero Config**          | ✅ Yes  | ⚠️ Some       | ❌ No     | ✅ Yes       |
| **Dual Build (CJS+ESM)** | ✅ Yes  | ✅ Yes        | ✅ Yes    | ✅ Native    |
| **Learning Curve**       | 🟢 Low  | 🟡 Medium     | 🟢 Low    | 🟢 Low       |

### When to Use Via

- ✅ You have an OpenAPI schema available
- ✅ You want compile-time type safety
- ✅ You value IntelliSense and autocomplete
- ✅ You want to catch API contract violations early
- ✅ You prefer lightweight solutions

### When to Use Alternatives

- **openapi-fetch**: You need advanced features like Zod validation
- **axios**: You need browser compatibility (IE11) or complex interceptors
- **native fetch**: You don't have typed schemas or want zero dependencies

---

## 🗺️ Roadmap

Via is under active development. Here's what's planned:

### v1.0 — Core Features (Q1 2026)

**Goal**: Production-ready typed client with essential features

- [ ] Untyped fallback mode for non-registered APIs
- [ ] Query parameter support with type safety
- [ ] Path parameter substitution (`/users/{id}`)
- [ ] Typed error responses (4xx/5xx status codes)
- [ ] Authentication helpers (Bearer, API Key)
- [ ] Request/response interceptors
- [ ] Comprehensive test suite (>90% coverage)
- [ ] Full API documentation

### v1.1 — Enhanced DX (Q2 2026)

**Goal**: Best-in-class developer experience

- [ ] SDK generation with grouped methods (`api.get.users.findById()`)
- [ ] JSDoc preservation in autocomplete
- [ ] FormData/multipart support
- [ ] Custom header configuration
- [ ] Retry logic with exponential backoff
- [ ] Better TypeScript error messages
- [ ] Example projects and recipes

### v1.2 — Developer Tools (Q2 2026)

**Goal**: Streamlined workflow automation

- [ ] Watch mode CLI (`via watch <url>`)
- [ ] Auto-regenerate on schema changes
- [ ] Hot reload integration
- [ ] Local file watching
- [ ] CI/CD integration helpers

### v2.0 — Advanced Features (Q3 2026)

**Goal**: Power user features

- [ ] Multi-status code type support
- [ ] Plugin/middleware system
- [ ] Request/response transformers
- [ ] Mock server for testing
- [ ] WebSocket support
- [ ] GraphQL adapter

### Future — Ecosystem

**Goal**: Complete API client ecosystem

- [ ] React hooks (`useApiQuery`, `useApiMutation`)
- [ ] Vue composables (`useApi`)
- [ ] VS Code extension for schema management
- [ ] Online documentation site
- [ ] Migration guides from axios/fetch
- [ ] Video tutorials and courses

**Want to contribute?** Check out our [Contributing Guide](#-contributing) and [GitHub Issues](https://github.com/jeportie/via/issues)!

---

## 🤝 Contributing

Contributions are welcome! Via is an open-source project and we'd love your help.

### For Developers

**See [DEV.md](DEV.md) for the complete development guide**, including:

- Development workflow and tooling
- Testing with Vitest
- Linting, formatting, and type checking
- Build system (dual CJS + ESM output)
- Git hooks and commit conventions
- Release process with semantic-release
- CLI development
- Troubleshooting

### Quick Setup

```bash
# Clone the repo
git clone https://github.com/jeportie/via.git
cd via

# Install dependencies (requires pnpm)
pnpm install

# Run tests in watch mode
pnpm dev

# Run all quality checks
pnpm check
```

### Project Structure

```
via/
├── src/
│   ├── FetchApi.ts          # Main client class
│   ├── types.ts             # Type utilities
│   ├── apiRegistry.ts       # Base URL → Schema mapping
│   ├── cli/                 # CLI commands
│   └── schema/              # Generated schemas
├── __tests__/               # Test suites
├── dist/                    # Build output (CJS + ESM)
└── .kanban/                 # Task management
```

### Available Commands

```bash
pnpm dev              # Watch mode for tests
pnpm test             # Run all tests
pnpm build            # Build CJS + ESM
pnpm check            # Format, lint, typecheck, test
pnpm format           # Format with Prettier
pnpm lint             # ESLint
pnpm typecheck        # TypeScript type checking
```

### Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add query parameter support
fix: correct path substitution bug
docs: update README examples
chore: bump dependencies
```

Commits trigger [semantic-release](https://semantic-release.gitbook.io/) for automated versioning.

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Ways to Contribute

- 🐛 **Report bugs** via [GitHub Issues](https://github.com/jeportie/via/issues)
- 💡 **Suggest features** in [Discussions](https://github.com/jeportie/via/discussions)
- 📖 **Improve documentation** (examples, guides, tutorials)
- 🧪 **Write tests** to increase coverage
- 🔧 **Fix issues** tagged as `good first issue`
- ⭐ **Star the repo** to show support

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:

- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [openapi-typescript](https://github.com/drwpow/openapi-typescript) — Schema generation
- [Vitest](https://vitest.dev/) — Testing framework
- [Conventional Commits](https://www.conventionalcommits.org/) — Commit standards

Inspired by:

- [openapi-fetch](https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-fetch) — Type-safe fetch client
- [axios](https://axios-http.com/) — HTTP client
- [ky](https://github.com/sindresorhus/ky) — Fetch wrapper

---

## 📬 Contact

- **Author**: Jérôme Portier
- **Email**: jeromep.dev@gmail.com
- **GitHub**: [@jeportie](https://github.com/jeportie)
- **Issues**: [github.com/jeportie/via/issues](https://github.com/jeportie/via/issues)

---

<div align="center">

**[⬆ Back to Top](#via)**

Made with ❤️ by the Via community

</div>
