# Development Guide

This document explains the development workflow, tooling, and conventions for the Via project.

## Table of Contents

- [Repository Overview](#repository-overview)
- [Development Workflow](#development-workflow)
- [Commit Standards](#commit-standards)
- [Linting](#linting)
- [Testing](#testing)
- [Code Formatting](#code-formatting)
- [Security Scanning](#security-scanning)
- [Spell Checking](#spell-checking)
- [Git Hooks](#git-hooks)
- [Semantic Release](#semantic-release)
- [Build System](#build-system)
- [Configuration Files Reference](#configuration-files-reference)

## Repository Overview

Via is a type-safe, extensible Fetch wrapper for modern TypeScript APIs. The project uses:

- **TypeScript** for type safety
- **Vitest** for testing
- **ESLint** for code quality
- **Prettier** for code formatting
- **Semantic Release** for automated versioning and publishing
- **Conventional Commits** for standardized commit messages
- **Husky** for git hooks
- **lint-staged** for pre-commit validation

## Development Workflow

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Development Commands

```bash
# Run tests in watch mode
pnpm dev

# Run all checks (format, lint, typecheck, secretlint, spellcheck, test)
pnpm check

# Build the project
pnpm build

# Format code
pnpm format

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Run tests
pnpm test
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:coverage       # With coverage report
```

### 3. Making Changes

1. Make your code changes
2. Run `pnpm check` to ensure everything passes
3. Stage your changes: `git add .`
4. Commit with a conventional commit message (see below)
5. Push to remote: `git push`

## Commit Standards

This repository uses **Conventional Commits** enforced by commitlint.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Rules

- **Header max length**: 100 characters
- **Body max line length**: 250 characters
- **Subject**: Must not be empty, start with lowercase
- **Type**: Required, must be lowercase
- **Spelling**: All parts are spell-checked using cspell

### Allowed Types

| Type       | Description                           | Version Bump  |
| ---------- | ------------------------------------- | ------------- |
| `feat`     | New feature                           | Minor (0.x.0) |
| `fix`      | Bug fix                               | Patch (0.0.x) |
| `docs`     | Documentation changes                 | Patch\*       |
| `style`    | Code style changes (formatting, etc.) | No release    |
| `refactor` | Code refactoring                      | Patch         |
| `perf`     | Performance improvements              | Patch         |
| `test`     | Adding/updating tests                 | No release    |
| `build`    | Build system changes                  | Patch\*       |
| `ci`       | CI configuration changes              | No release    |
| `chore`    | Other changes                         | No release    |
| `revert`   | Revert a previous commit              | Depends       |

\* Only with specific scopes (README for docs, output for build)

### Examples

**Good commits:**

```bash
feat: add support for custom headers
feat(auth): implement JWT token refresh
fix: resolve memory leak in request pooling
fix(types): correct return type for get method
docs(README): update installation instructions
refactor: simplify error handling logic
perf: optimize request caching mechanism
test: add unit tests for Via class
```

**Bad commits (will be rejected):**

```bash
# Missing type
update readme

# Empty subject
feat:

# Invalid type
updated: fix the bug

# Subject starts with uppercase
feat: Add new feature

# Spelling error in message
feat: add request caching
```

### Commit Message Validation

When you commit, the following checks run automatically:

1. **Type validation**: Must be one of the allowed types
2. **Format validation**: Must follow conventional commit format
3. **Spell checking**: All words in commit message are checked
4. **Length validation**: Header ≤ 100 chars, body lines ≤ 250 chars

## Linting

### ESLint Configuration

The project uses ESLint with TypeScript support and multiple plugins.

**Key rules:**

- **Import ordering**: Alphabetical, with newlines between groups
- **Single quotes**: Enforced for strings
- **No default exports**: Except in config files and tests
- **Import validation**: No cycles, deprecated imports, or unresolved modules
- **TypeScript strict rules**: From `@webdeveric/eslint-config-ts`

### Running the Linter

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint --fix

# ESLint runs automatically on staged files during commit
```

### What ESLint Checks

1. **Code quality**: Unused variables, unreachable code, etc.
2. **TypeScript best practices**: Type assertions, any usage, etc.
3. **Import organization**: Order, cycles, deprecated imports
4. **Code style**: Quotes, spacing (via @stylistic plugin)
5. **Security**: Potential security issues

## Testing

### Vitest Configuration

The project uses Vitest for unit and integration testing.

**Test structure:**

- Unit tests: `**/*.test.ts`
- Integration tests: `**/*.int.test.ts`
- Setup file: `__tests__/setup.ts`

### Running Tests

```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm dev

# Run with coverage
pnpm test:coverage

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration
```

### Test Requirements

- All tests must pass before committing
- Coverage reports are generated in `./coverage`
- Related tests run automatically on staged file changes (via lint-staged)

### Writing Tests

```typescript
import { describe, expect, it } from 'vitest';

describe('Via', () => {
  it('should create a new instance', () => {
    const via = new Via('https://api.example.com');
    expect(via).toBeDefined();
  });
});
```

## Code Formatting

### Prettier Configuration

The project uses Prettier with the following settings:

- **Print width**: 120 characters
- **Tab width**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing commas**: All
- **Arrow parens**: Always
- **Import organization**: Auto-sorted via plugin

### Running Prettier

```bash
# Format all files
pnpm format

# Prettier runs automatically on all staged files during commit
```

### What Gets Formatted

- TypeScript/JavaScript files
- JSON files
- YAML files
- Markdown files
- Configuration files

## Security Scanning

### Secretlint Configuration

The project uses secretlint to prevent committing secrets.

**What it detects:**

- API keys
- Tokens
- Passwords
- Private keys
- AWS credentials
- Generic secret patterns

### Pattern Detection

Custom pattern for detecting generic secrets:

```regex
((api|token|secret|password|auth)[\\w .,-]{0,25})([=>:]|:=).{0,5}['\"]([\\w=-]{8,64})['\"]
```

### Running Secretlint

```bash
# Check for secrets
pnpm secretlint

# Secretlint runs automatically on all staged files during commit
```

## Spell Checking

### cspell Configuration

The project uses cspell to catch spelling errors in code and documentation.

**What it checks:**

- TypeScript/JavaScript files
- Markdown files
- JSON files
- Configuration files
- Commit messages
- File names

### Running cspell

```bash
# Check spelling
pnpm spellcheck

# cspell runs automatically on all staged files during commit
```

### Adding Words to Dictionary

Edit `cspell.json` to add words to the allowed list:

```json
{
  "words": ["jeportie", "vitest", "commitlint"]
}
```

## Git Hooks

### Husky Configuration

The project uses Husky to manage git hooks.

### Pre-commit Hook

**File**: `.husky/pre-commit`

Runs `lint-staged` which executes the following on staged files:

1. **For `*.{js,cjs,mjs,ts,cts,mts}` files:**

   - ESLint with auto-fix

2. **For `*.{js,cjs,mjs,ts,cts,mts,json,yml,yaml}` files:**

   - Run related tests (excluding integration tests)

3. **For all files:**
   - cspell lint (content)
   - cspell filename check
   - Prettier formatting
   - secretlint scan

### Commit-msg Hook

**File**: `.husky/commit-msg`

Runs `commitlint` to validate commit message format.

### What Happens on Commit

```bash
git add .
git commit -m "feat: add new feature"

# Automatic execution:
# 1. Husky triggers pre-commit hook
# 2. lint-staged backs up original state
# 3. For staged files:
#    - ESLint fixes issues
#    - Related tests run
#    - cspell checks spelling
#    - Prettier formats code
#    - secretlint scans for secrets
# 4. If all pass, changes are applied
# 5. Husky triggers commit-msg hook
# 6. commitlint validates message format
# 7. If valid, commit succeeds
```

### Bypass Hooks (Not Recommended)

```bash
# Skip all hooks
git commit --no-verify -m "message"

# ⚠️ Only use in emergencies - CI will still validate
```

## Semantic Release

### Overview

The project uses semantic-release for automated versioning and publishing.

**Version**: `0.0.0-semantically-released` (automatically updated on release)

### How It Works

1. **Analyze Commits**: Reads commit messages to determine version bump
2. **Generate Release Notes**: Creates changelog from commits
3. **Update Version**: Bumps version in package.json
4. **Publish to npm**: Publishes package to npm registry
5. **Create GitHub Release**: Creates release with changelog

### Versioning Rules

Based on commit types:

| Commits           | Version Bump  | Example       |
| ----------------- | ------------- | ------------- |
| `feat`            | Minor (0.x.0) | 1.0.0 → 1.1.0 |
| `fix`             | Patch (0.0.x) | 1.0.0 → 1.0.1 |
| `perf`            | Patch         | 1.0.0 → 1.0.1 |
| `refactor`        | Patch         | 1.0.0 → 1.0.1 |
| `docs(README)`    | Patch         | 1.0.0 → 1.0.1 |
| `build(output)`   | Patch         | 1.0.0 → 1.0.1 |
| `BREAKING CHANGE` | Major (x.0.0) | 1.0.0 → 2.0.0 |

### Release Branches

| Branch       | Description          | Release Type |
| ------------ | -------------------- | ------------ |
| `main`       | Production releases  | Stable       |
| `next`       | Next version preview | Stable       |
| `next-major` | Next major version   | Stable       |
| `beta`       | Beta releases        | Pre-release  |
| `alpha`      | Alpha releases       | Pre-release  |

### Release Notes Sections

The release notes are organized by commit type:

- **Features** (`feat`)
- **Bug Fixes** (`fix`)
- **Performance Improvements** (`perf`)
- **Reverts** (`revert`)
- **Documentation** (`docs`)
- **Styles** (`style`)
- **Code Refactoring** (`refactor`)
- **Tests** (`test`)
- **Build System** (`build`)
- **Continuous Integration** (`ci`)
- **Miscellaneous Chores** (`chore`)

### Triggering a Release

Releases are triggered automatically by CI when commits are pushed to release branches:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push

# CI runs semantic-release
# → Analyzes commits since last release
# → Determines version bump (minor for feat)
# → Publishes to npm
# → Creates GitHub release
```

### Preventing a Release

Use scope `no-release`:

```bash
git commit -m "chore(no-release): update internal tooling"
```

## Build System

### Build Configuration

The project builds both CommonJS and ES modules.

**Output structure:**

```
dist/
├── cjs/              # CommonJS modules
│   ├── index.js
│   └── package.json  # {"type": "commonjs"}
├── mjs/              # ES modules
│   ├── index.js
│   └── package.json  # {"type": "module"}
└── types/            # TypeScript declarations
    └── index.d.ts
```

### Build Process

```bash
pnpm build

# Executes:
# 1. pnpm check (format, lint, typecheck, test)
# 2. rimraf dist (clean)
# 3. tsc -p tsconfig.build-cjs.json
# 4. tsc -p tsconfig.build-mjs.json
# 5. Create package.json files in dist/cjs and dist/mjs
# 6. validate-package-exports (verify exports)
```

### Package Exports

```json
{
  "main": "dist/cjs/index.js",
  "types": "dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "require": "./dist/cjs/index.js",
      "import": "./dist/mjs/index.js"
    }
  }
}
```

## Configuration Files Reference

### Core Configuration

| File                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `package.json`            | Package metadata, scripts, dependencies |
| `tsconfig.json`           | Base TypeScript configuration           |
| `tsconfig.build-cjs.json` | TypeScript config for CommonJS build    |
| `tsconfig.build-mjs.json` | TypeScript config for ES modules build  |

### Code Quality

| File                  | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `.eslintrc.cjs`       | ESLint configuration and rules              |
| `.eslintignore`       | Files/directories excluded from linting     |
| `prettier.config.cjs` | Prettier formatting rules                   |
| `.prettierignore`     | Files/directories excluded from formatting  |
| `.editorconfig`       | Editor settings (indentation, line endings) |

### Git & Version Control

| File                     | Purpose                             |
| ------------------------ | ----------------------------------- |
| `.gitignore`             | Files/directories excluded from git |
| `.husky/pre-commit`      | Pre-commit hook (runs lint-staged)  |
| `.husky/commit-msg`      | Commit message validation hook      |
| `commitlint.config.js`   | Commit message format rules         |
| `lint-staged.config.mjs` | Pre-commit file validation tasks    |

### Testing

| File                         | Purpose                          |
| ---------------------------- | -------------------------------- |
| `vitest.config.ts`           | Vitest test runner configuration |
| `__tests__/setup.ts`         | Test environment setup           |
| `__tests__/**/*.test.ts`     | Unit tests                       |
| `__tests__/**/*.int.test.ts` | Integration tests                |

### Security & Quality

| File                 | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `.secretlintrc.json` | Secret scanning configuration              |
| `.secretlintignore`  | Files excluded from secret scanning        |
| `cspell.json`        | Spell checker configuration and dictionary |

### Release & Publishing

| File                 | Purpose                               |
| -------------------- | ------------------------------------- |
| `release.config.mjs` | Semantic release configuration        |
| `commit.hbs`         | Handlebars template for release notes |
| `.npmrc`             | npm configuration                     |
| `.npmignore`         | Files excluded from npm package       |

### Environment

| File                | Purpose                                |
| ------------------- | -------------------------------------- |
| `.nvmrc`            | Node.js version specification          |
| `mise.toml`         | mise (rtx) tool version manager config |
| `pnpm-lock.yaml`    | pnpm lockfile (exact dependencies)     |
| `package-lock.json` | npm lockfile (fallback)                |

### GitHub

| Directory/File       | Purpose                       |
| -------------------- | ----------------------------- |
| `.github/`           | GitHub-specific configuration |
| `.github/workflows/` | CI/CD workflow definitions    |

## Summary

This repository enforces high code quality standards through automated tooling:

1. **Pre-commit**: lint-staged runs ESLint, tests, cspell, Prettier, and secretlint
2. **Commit message**: commitlint validates conventional commit format
3. **CI/CD**: GitHub Actions runs full checks and semantic-release
4. **Release**: Automated versioning and publishing based on commit types

All tools work together to ensure consistent, high-quality code that follows best practices.
