# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Via is a lightweight, composable Fetch wrapper for building type-safe API clients in TypeScript. It provides compile-time type safety through OpenAPI schema integration while maintaining runtime flexibility.

Key capabilities:
- Generate TypeScript types from OpenAPI specifications
- Type-safe REST client with runtime validation
- Support for both typed (OpenAPI-based) and untyped fetch operations
- Dual-build output (CommonJS + ESM)

## Build & Development Commands

### Package Manager
This project uses `pnpm` (version 9.6.0). All commands should use `pnpm`, not `npm` or `yarn`.

### Common Commands

```bash
# Install dependencies
pnpm install

# Development mode (watch tests)
pnpm dev

# Run all quality checks (format, lint, typecheck, secretlint, spellcheck, test)
pnpm check

# Build the project (runs checks, then builds CJS + MJS)
pnpm build

# Linting and formatting
pnpm format          # Format code with Prettier
pnpm lint            # ESLint
pnpm typecheck       # TypeScript type checking
pnpm secretlint      # Check for leaked secrets
pnpm spellcheck      # Spell check using cspell

# Testing
pnpm test                 # Run all tests (unit + integration)
pnpm test:unit            # Run unit tests only
pnpm test:integration     # Run integration tests only
pnpm test:coverage        # Run tests with coverage report

# CLI tool
pnpm via                  # Run the Via CLI (must build first)
```

### Build System

The project outputs two module formats:
- **CommonJS**: `dist/cjs/` (with package.json `{"type":"commonjs"}`)
- **ESM**: `dist/mjs/` (with package.json `{"type":"module"}`)

Build process runs TypeScript compiler twice with different configs:
- `tsconfig.build-cjs.json` for CommonJS
- `tsconfig.build-mjs.json` for ESM

## Kanban Task Management System

This project uses a kanban-style system for tracking tasks and features located in `.kanban/`.

### Folder Structure

```
.kanban/
├── to-do/       # Tasks ready to be worked on
├── to-test/     # Tasks implemented and ready for testing
├── hold-on/     # Tasks blocked or on hold
├── done/        # Completed tasks
├── analyze/     # Tasks requiring analysis or investigation
└── agents/      # Specialized agent documentation
```

### Workflow

1. **Create requests**: Add `001_request.md` files in `.kanban/to-do/` with **one task or feature per file**
2. **Sequential naming**: Use `001_request.md`, `002_request.md`, etc. (leading zeros for proper sorting)
3. **Move between folders**: As work progresses, move files between folders (don't copy)
4. **Track progress**: Files move through the workflow stages until completion

### Request File Format

Each request file should contain:
- Clear description of the task/feature
- Acceptance criteria (checkboxes)
- Context and background information
- Any relevant notes or constraints

See `.kanban/README.md` for the complete template.

### Specialized Agents

Three specialized agents are available to assist with different phases:

**Einstein Agent** (`.kanban/agents/EINSTEIN_AGENT.md`)
- Deep analysis and investigation
- Architecture and design decisions
- Problem-solving and strategic planning
- Use for tasks in `analyze/` folder

**Tester Agent** (`.kanban/agents/TESTER_AGENT.md`)
- Comprehensive testing implementation
- Test coverage improvement
- Bug verification and regression testing
- Use for tasks in `to-test/` folder

**Refactor Agent** (`.kanban/agents/REFACTOR_AGENT.md`)
- Code quality improvement
- Performance optimization
- Technical debt reduction
- Architecture refinement

When working on tasks, consult the appropriate agent documentation for guidance on best practices and workflows.

## Core Architecture

### Type System (`src/types.ts`)

The type system extracts TypeScript types from OpenAPI schemas using advanced type utilities:

- `FilterRoutes<Schema, Method>`: Filters schema endpoints by HTTP method
- `ApiBody<Schema, Endpoint, Method>`: Extracts request body type from operation
- `ApiReturn<Schema, Endpoint, Method>`: Extracts response type from operation
- `ApiParams<Schema, Endpoint, Method>`: Extracts URL/query parameters

These types work by traversing the OpenAPI schema structure:
1. Navigate to endpoint → method → operation
2. Extract `requestBody.content['application/json']` for bodies
3. Extract `responses[200].content['application/json']` for return types
4. Extract `parameters` for query/path params

### FetchApi Client (`src/FetchApi.ts`)

Generic API client class that provides type-safe HTTP methods:

```typescript
class FetchApi<D extends keyof ApiRegistry> {
  constructor(baseUrl: D)  // baseUrl must be a key in ApiRegistry

  get<E extends FilterRoutes<ApiRegistry[D], 'GET'>>(endpoint: E)
  post<E extends FilterRoutes<ApiRegistry[D], 'POST'>>(endpoint: E, body: ApiBody<...>)
  put<E extends FilterRoutes<ApiRegistry[D], 'PUT'>>(endpoint: E, body: ApiBody<...>)
  delete<E extends FilterRoutes<ApiRegistry[D], 'DELETE'>>(endpoint: E)
}
```

Key design points:
- Uses TypeScript generics to enforce endpoint/method compatibility
- Private `#request()` method handles fetch logic
- All methods are type-safe: wrong endpoint for a method = compile error
- Returns typed promises based on OpenAPI response schemas

### API Registry (`src/apiRegistry.ts`)

Central mapping between runtime base URLs and compile-time schemas:

```typescript
export interface ApiRegistry {
  'https://petstore3.swagger.io': petstoreSchema;
  // Additional APIs added via CLI
}
```

This file is auto-generated/updated by the CLI. The registry:
- Maps base URLs (used at runtime) to OpenAPI schema types
- Enables IntelliSense for all registered APIs
- Is the single source of truth for available APIs

### CLI Tool (`src/cli/`)

Interactive CLI for managing API schemas:

**Entry point**: `src/cli/index.ts`
- Prompts user to choose OpenAPI or manual mode
- Ensures registry exists via `ensureRegistryExists()`

**OpenAPI mode**: `src/cli/generate.ts`
- Prompts for OpenAPI URL, base URL, and schema name
- Uses `openapi-typescript` to generate types from OpenAPI spec
- Saves schema to `src/schema/{schemaName}.ts`
- Updates registry via `updateRegistry()`

**Registry management**: `src/cli/registry.ts` + `src/cli/updateRegistry.ts`
- Creates empty registry if missing
- Adds import statements and registry entries
- Prevents duplicate base URLs

## Testing

Tests are located in `__tests__/` and use Vitest.

Test file naming convention:
- Unit tests: `*.test.ts` or `*.spec.ts`
- Integration tests: `*.test.ts` or `*.spec.ts` (identified by directory structure)

Test setup: `__tests__/setup.ts`

## TypeScript Configuration

Strict mode enabled with additional strictness:
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- `verbatimModuleSyntax: true`

Module system: `NodeNext` (supports both ESM and CJS)

## Commit & Release

This project uses:
- **Conventional Commits**: Enforced via commitlint
- **Semantic Release**: Automated versioning based on commit messages
- **Husky**: Git hooks for pre-commit checks (lint-staged)

Commit format: `type(scope?): subject`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, etc.
- Commits trigger semantic-release on main branch

## Key Design Patterns

1. **Schema-first approach**: OpenAPI schemas are the source of truth for types
2. **Type-level programming**: Heavy use of conditional types and mapped types
3. **Generic constraints**: Base URL and endpoints are constrained by registry
4. **Separation of concerns**: CLI, types, runtime client are independent layers
5. **Dual-format output**: Supports both ESM and CJS consumers
