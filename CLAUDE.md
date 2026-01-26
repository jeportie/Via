# CLAUDE.md

This file provides guidance to Claude Code when working on Via.

## Project Overview

Via is a lightweight, composable Fetch wrapper for building type-safe API clients in TypeScript. It provides compile-time type safety through OpenAPI schema integration.

**Key capabilities:**

- Generate TypeScript types from OpenAPI specifications
- Type-safe REST client with full IntelliSense
- Support for both typed (OpenAPI-based) and untyped fetch operations
- Dual-build output (CommonJS + ESM)

## Development Commands

**Package Manager:** Use `pnpm` (version 9.6.0), not npm or yarn.

```bash
# Development
pnpm install             # Install dependencies
pnpm dev                 # Watch mode (tests)
pnpm build               # Build project (CJS + ESM)

# Quality Checks
pnpm check               # Run all checks (format, lint, typecheck, test)
pnpm lint                # ESLint
pnpm format              # Prettier
pnpm typecheck           # TypeScript type checking

# Testing
pnpm test                # Run all tests
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:coverage       # Coverage report
```

## Kanban Workflow

Tasks are managed in `.kanban/` following a TDD/Agile cycle:

```
to-do → hold-on → in-progress → to-test → analyze → done
         (optional)
```

### Folders

- **to-do/**: Tasks ready to implement (clear requirements, no blockers)
- **hold-on/**: Tasks blocked or needing human decision/architecture discussion
- **in-progress/**: Active development (implement feature)
- **to-test/**: Write and run tests (TDD phase)
- **analyze/**: Code review, refactoring, optimization
- **done/**: Completed and merged

### Workflow Process

1. **Pick a todo** from `to-do/` (e.g., `001_rename_fetchapi.md`)
2. **Read the todo** - Follow implementation steps
3. **Start work** - Move file to `in-progress/`
4. **Implement** - Write code following acceptance criteria
5. **Move to test** - Move file to `to-test/`, write tests
6. **Run tests** - Ensure all tests pass, coverage >80%
7. **Move to analyze** - Move file to `analyze/`, review & refactor
8. **Complete** - Move file to `done/` when approved and merged

### Todo File Format

Each todo follows this structure (see `.kanban/TODO_TEMPLATE.md`):

```markdown
# NNN - Title

## 📋 Description

[What needs to be done]

## 🎯 Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## 🧪 How to Test

[Testing instructions]

## 🛠️ How to Implement

- Implementation approach
- Key files involved
- Step-by-step guide
```

### When to Use hold-on/

Move todos to `hold-on/` when:

- Architecture decision needed (multiple valid approaches)
- Requirements unclear
- Blocked by external dependency
- Need human input before proceeding

**Don't guess** - ask the user and document the decision.

## Core Architecture

### Type System (`src/types.ts`)

Type utilities that extract types from OpenAPI schemas:

- `FilterRoutes<Schema, Method>` - Filter endpoints by HTTP method
- `ApiBody<Schema, Endpoint, Method>` - Extract request body type
- `ApiReturn<Schema, Endpoint, Method>` - Extract response type
- `ApiParams<Schema, Endpoint, Method>` - Extract URL/query parameters

### FetchApi Client (`src/FetchApi.ts`)

Generic API client with type-safe HTTP methods:

```typescript
class FetchApi<D extends keyof ApiRegistry> {
  constructor(baseUrl: D)  // baseUrl must be in ApiRegistry

  get<E extends FilterRoutes<...>>(endpoint: E)
  post<E extends FilterRoutes<...>>(endpoint: E, body: ApiBody<...>)
  put<E extends FilterRoutes<...>>(endpoint: E, body: ApiBody<...>)
  delete<E extends FilterRoutes<...>>(endpoint: E)
}
```

Wrong endpoint for a method = compile error.

### API Registry (`src/apiRegistry.ts`)

Maps runtime base URLs to compile-time schemas:

```typescript
export interface ApiRegistry {
  'https://petstore3.swagger.io/api/v3': petstoreSchema;
  // Additional APIs added via CLI
}
```

This is the single source of truth for available APIs.

### CLI Tool (`src/cli/`)

Interactive CLI for managing API schemas:

```bash
pnpm via
# Prompts for:
# - OpenAPI URL
# - Base URL
# - Schema name
#
# Generates:
# - src/schema/{name}.ts (types)
# - Updates src/apiRegistry.ts
```

## Build System

Dual-build output:

- **CommonJS**: `dist/cjs/`
- **ESM**: `dist/mjs/`

Runs TypeScript compiler twice:

- `tsconfig.build-cjs.json`
- `tsconfig.build-mjs.json`

## TypeScript Configuration

Strict mode with:

- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- `verbatimModuleSyntax: true`

Module system: `NodeNext` (supports both ESM and CJS)

## Git & Commits

**Conventional Commits** (enforced via commitlint):

```bash
feat: add new feature
fix: bug fix
docs: documentation
refactor: code refactoring
test: add tests
chore: maintenance
```

**Semantic Release**: Automated versioning based on commit messages

**Husky**: Pre-commit hooks (lint-staged)

## Best Practices

1. **Read the todo first** - Follow the implementation steps
2. **Move files as you progress** - Keep kanban updated
3. **Write tests** - Aim for >80% coverage
4. **Run `pnpm check`** - Before committing
5. **Commit with conventional format** - For semantic-release
6. **Ask when unclear** - Use hold-on/ folder, don't guess
7. **Keep todos small** - One feature/fix per todo
8. **Document decisions** - Update CLAUDE.md when patterns change

## Key Design Patterns

1. **Schema-first**: OpenAPI schemas are source of truth
2. **Type-level programming**: Heavy use of conditional types
3. **Generic constraints**: Base URLs constrained by registry
4. **Separation of concerns**: CLI, types, runtime client are independent
5. **Dual-format output**: Both ESM and CJS support
