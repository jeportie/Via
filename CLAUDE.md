# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Via is a lightweight, composable Fetch wrapper for building type-safe API clients in TypeScript. It provides compile-time type safety through OpenAPI schema integration while maintaining runtime flexibility.

Key capabilities:
- Generate TypeScript types from OpenAPI specifications
- Type-safe REST client with runtime validation
- Support for both typed (OpenAPI-based) and untyped fetch operations
- Dual-build output (CommonJS + ESM)

## AI/Human Pair Programming System

This project uses a professional AI/human collaborative development system with Docker sandbox isolation, Makefile automation, and a structured Kanban workflow.

### Quick Start

```bash
# Initial setup (first time only)
make setup

# Enter the Claude Code sandbox (most common command)
make claude

# View available commands
make help

# Check project status
make kanban-status
make stats
```

### Makefile Commands

The project uses a comprehensive Makefile with 50+ commands organized into categories:

**Most Used Commands:**
```bash
make claude              # Enter Docker sandbox (secure AI environment)
make dev                 # Start development mode (watch tests)
make test                # Run all tests
make check               # Run all quality checks
make ci                  # Run CI locally (same as GitHub Actions)
make kanban-status       # View Kanban board status
make commit-ready        # Prepare code for commit
```

**Docker Sandbox:**
```bash
make sandbox             # Build and enter sandbox
make sandbox-secure      # Enter secure sandbox (read-only, no network)
make sandbox-clean       # Remove sandbox image
make sandbox-exec CMD="pnpm test"  # Execute command in sandbox
```

**Development:**
```bash
make install             # Install dependencies with pnpm
make build               # Build project (CJS + ESM)
make clean               # Clean build artifacts
make dev                 # Watch mode
```

**Testing:**
```bash
make test                # All tests
make test-unit           # Unit tests only
make test-integration    # Integration tests only
make test-coverage       # Coverage report
```

**Quality Checks:**
```bash
make check               # All checks (format, lint, typecheck, test)
make lint                # ESLint
make lint-fix            # ESLint with auto-fix
make format              # Prettier format
make typecheck           # TypeScript check
```

**Kanban Workflow:**
```bash
make kanban-status       # Show board status
make kanban-list         # List all todos
make kanban-move FROM=to-do TO=in-progress FILE=001_task.md
make branch-create TODO=001  # Create feature branch
```

**CI/CD:**
```bash
make ci                  # Full CI pipeline locally
make ci-quick            # Quick checks (no tests)
make prepublish          # Prepare for npm publish
```

See `make help` for all 50+ commands or refer to the [Quick Start Guide](.claude/QUICK_START.md).

### Package Manager
This project uses `pnpm` (version 9.6.0). All commands should use `pnpm`, not `npm` or `yarn`.

### Direct pnpm Commands

You can also use pnpm directly (especially inside the sandbox):

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

This project uses a professional kanban-style system following Agile, DDD, and CI/CD principles. Tasks flow through defined stages with specialized AI agents handling each phase.

### Folder Structure

```
.kanban/
├── backlog/         # Future work and ideas
├── to-do/           # Ready for implementation
├── hold-on/         # Needs human decision or architecture discussion
├── in-progress/     # Currently being implemented
├── to-test/         # Implementation complete, ready for testing
├── analyze/         # Code review, refactoring, DevOps review
├── done/            # Completed and merged to main
├── groups/          # Todo grouping metadata
└── TODO_TEMPLATE.md # Standard todo format
```

### Workflow Stages

**Backlog** → **To-Do** → **Hold-On** (optional) → **In-Progress** → **To-Test** → **Analyze** → **Done**

1. **Backlog**: Ideas and future features collected here
2. **To-Do**: Tasks ready to be implemented (clear requirements, no blockers)
3. **Hold-On**: Tasks needing human input (architecture decisions, unclear requirements)
4. **In-Progress**: Active development (git branch created, implementation started)
5. **To-Test**: Implementation complete, tests being validated
6. **Analyze**: Code review, refactoring, security audit, DevOps review
7. **Done**: Approved, merged to main, deployed

### Todo File Format

Each todo follows a standardized template with these sections:

```markdown
# [TODO ID] - [Title]

## 📋 Description
[What needs to be done]

## 🎯 Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## 🧪 How to Test
[Testing instructions for human and AI]

## ✅ When to Validate
[Conditions for completion]

## 🛠️ How to Implement
- Implementation Approach
- Difficulty Level
- Key Files Involved
- Attention Points
- Step-by-step guide

## 📚 Context & References
[Links and documentation]

## 🔗 Dependencies
[Related todos]
```

See `.kanban/TODO_TEMPLATE.md` for the complete template.

### Specialized Agents

Seven specialized agents handle different workflow phases (located in `.claude/agents/`):

**1. Planner Agent**
- Creates structured todos from requirements
- Assigns difficulty and priority
- Identifies dependencies
- Use: When creating new todos from ideas/issues

**2. Architect Agent** (`.claude/agents/EINSTEIN_AGENT.md`)
- Handles architecture discussions
- Presents options with pros/cons
- Documents technical decisions
- Use: For tasks in `hold-on/` needing human input

**3. Implementer Agent**
- Executes implementation
- Creates git branches
- Writes code and tests
- Use: For tasks in `in-progress/`

**4. Tester Agent** (`.claude/agents/TESTER_AGENT.md`)
- Validates acceptance criteria
- Runs test suite
- Checks coverage
- Use: For tasks in `to-test/`

**5. Analyzer Agent** (`.claude/agents/REFACTOR_AGENT.md`)
- Code quality review
- Performance analysis
- Security audit
- Refactoring suggestions
- Use: For tasks in `analyze/`

**6. Release Agent**
- Version management
- Changelog generation
- Merges to main
- Creates releases
- Use: For approved tasks moving to `done/`

**7. Issue Sync Agent**
- Syncs GitHub issues
- Creates todos from issues
- Updates issue status
- Use: Automatic sync (hourly/daily)

### Git Integration

Each todo gets its own git branch:
- **Features**: `feat/001-feature-name`
- **Fixes**: `fix/002-bug-name`
- **Refactor**: `refactor/003-cleanup`

Use `make branch-create TODO=001` to create branches automatically.

### Viewing and Managing Todos

```bash
# View board status
make kanban-status

# List all todos
make kanban-list

# Move todo between stages
make kanban-move FROM=to-do TO=in-progress FILE=001_task.md

# Create feature branch from todo
make branch-create TODO=001
```

### Security & Isolation

All AI work happens in a Docker sandbox with:
- No sudo access
- Secrets removed
- Resource limits
- Optional network isolation
- Read-only filesystem option

Enter sandbox: `make claude`

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

## Docker Sandbox Environment

The project includes a secure Docker sandbox for AI pair programming:

### Features
- **Isolated Environment**: AI runs in containerized environment
- **Security**: No sudo access, secrets removed, capabilities dropped
- **Resource Limits**: CPU, memory, and process limits enforced
- **Network Options**: Can run with or without network access
- **Read-Only Mode**: Optional immutable filesystem

### Usage

```bash
# Enter sandbox (most common)
make claude

# Secure mode (read-only, no network)
make sandbox-secure

# Execute command without entering
make sandbox-exec CMD="pnpm test"

# Using docker-compose
docker-compose up -d via-sandbox
docker-compose exec via-sandbox sh
```

### Configuration

- **Dockerfile**: `docker/Dockerfile.sandbox`
- **Compose**: `docker-compose.yml`
- **Security**: Non-root user, no privileged operations
- **Secrets**: Excluded via `.dockerignore`

## Documentation

### Core Documentation
- **[System Design](.claude/SYSTEM_DESIGN.md)**: Complete architecture (500+ lines)
  - Workflow stages and agent specifications
  - Git branching strategy
  - CI/CD pipelines
  - Security features
  - Advanced features (grouping, issue sync, rollback)

- **[Quick Start](.claude/QUICK_START.md)**: 5-minute onboarding guide
  - Common commands
  - Typical workflows
  - Best practices
  - Troubleshooting

- **[Implementation Summary](.claude/IMPLEMENTATION_SUMMARY.md)**: What's been built
  - Current state
  - Features implemented
  - Next steps
  - Success metrics

### Kanban Documentation
- **[Todo Template](.kanban/TODO_TEMPLATE.md)**: Standard format for all todos
- **[Kanban README](.kanban/README.md)**: Workflow guide

### Agent Documentation
Located in `.claude/agents/`:
- Specialized agent specifications
- Best practices for each workflow stage
- When to use which agent

## Best Practices for AI Assistants

### Working with the Codebase

1. **Always work in sandbox**: Run `make claude` before making changes
2. **Check Kanban first**: Run `make kanban-status` to see current work
3. **Follow todo template**: Use `.kanban/TODO_TEMPLATE.md` for new todos
4. **One todo per file**: Keep todos focused and small
5. **Move between stages**: Use `make kanban-move` as work progresses
6. **Create feature branches**: Use `make branch-create TODO=NNN`
7. **Run quality checks**: Use `make commit-ready` before committing
8. **Document decisions**: Update CLAUDE.md when patterns change

### Architecture Decisions

When faced with architectural choices:
1. **Move to hold-on**: Don't guess, ask human
2. **Present options**: Show pros/cons of each approach
3. **Document decision**: Update CLAUDE.md with chosen pattern
4. **Update todos**: Reflect decision in implementation steps

### Code Quality

- **TypeScript strict mode**: No `any` types in public APIs
- **Test coverage**: >80% required
- **Conventional commits**: Required for semantic versioning
- **Small PRs**: One todo = one PR ideally
- **Security**: Never commit secrets, always run in sandbox

### Using Makefile Commands

Prefer Makefile commands over direct tool invocation:
- ✅ `make test` (consistent, documented)
- ❌ `pnpm test` (direct, less discoverable)

Exception: Inside sandbox, use `pnpm` commands directly for interactive work.
