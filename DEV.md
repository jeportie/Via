# Development Guide

> Complete guide to developing Via - tooling, testing, packaging, and workflows

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Development Workflow](#development-workflow)
- [Tooling](#tooling)
  - [Package Manager](#package-manager-pnpm)
  - [TypeScript](#typescript)
  - [Linting](#linting-eslint)
  - [Formatting](#formatting-prettier)
  - [Testing](#testing-vitest)
  - [Secret Detection](#secret-detection-secretlint)
  - [Spell Checking](#spell-checking-cspell)
- [Build System](#build-system)
- [Git Hooks](#git-hooks-husky)
- [Release Process](#release-process-semantic-release)
- [CLI Development](#cli-development)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **pnpm**: 9.6.0 (package manager)
- **Git**: For version control

```bash
# Install pnpm globally
npm install -g pnpm@9.6.0

# Verify installation
node --version   # Should be 18+
pnpm --version   # Should be 9.6.0
```

---

## Setup

```bash
# Clone repository
git clone https://github.com/jeportie/via.git
cd via

# Install dependencies
pnpm install

# Verify setup
pnpm check
```

---

## Development Workflow

### 1. Pick a Todo

```bash
# View available todos
ls .kanban/to-do/

# Read a todo
cat .kanban/to-do/001_rename_fetchapi_to_via.md

# Move to in-progress
mv .kanban/to-do/001_*.md .kanban/in-progress/
```

### 2. Start Development

```bash
# Start watch mode (runs tests on save)
pnpm dev

# In another terminal, make your changes
```

### 3. Write Tests

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch specific test file
pnpm test __tests__/unit/FetchApi.test.ts
```

### 4. Check Code Quality

```bash
# Run all quality checks
pnpm check

# Individual checks
pnpm lint          # ESLint
pnpm format        # Prettier (auto-fix)
pnpm typecheck     # TypeScript
pnpm secretlint    # Secret detection
pnpm spellcheck    # Spell check
```

### 5. Build

```bash
# Build both CJS and ESM
pnpm build

# Validate package exports
pnpm validate
```

### 6. Commit

```bash
# Stage changes
git add .

# Commit with conventional format
git commit -m "feat: add new feature"

# Pre-commit hooks will run automatically:
# - Prettier format
# - ESLint fix
# - Commit message validation
```

### 7. Move Todo

```bash
# Move through kanban stages
mv .kanban/in-progress/001_*.md .kanban/to-test/      # After implementing
mv .kanban/to-test/001_*.md .kanban/analyze/          # After tests pass
mv .kanban/analyze/001_*.md .kanban/done/             # After approval
```

---

## Tooling

### Package Manager: pnpm

**Why pnpm?**

- Fast and disk-space efficient
- Strict dependency management
- Better monorepo support

**Key Commands:**

```bash
pnpm install              # Install all dependencies
pnpm add <package>        # Add dependency
pnpm add -D <package>     # Add dev dependency
pnpm remove <package>     # Remove dependency
pnpm list                 # Show dependency tree
pnpm outdated             # Check for updates
pnpm update               # Update dependencies
```

**Configuration:** `package.json`

```json
{
  "packageManager": "pnpm@9.6.0"
}
```

### TypeScript

**Configuration Files:**

- `tsconfig.json` - Base config (development)
- `tsconfig.build-cjs.json` - CommonJS build
- `tsconfig.build-mjs.json` - ESM build

**Strict Mode Enabled:**

```json
{
  "strict": true,
  "exactOptionalPropertyTypes": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true,
  "verbatimModuleSyntax": true
}
```

**Module System:** `NodeNext`

- Supports both ESM (`import`/`export`) and CJS (`require`)
- Requires `.js` extensions in imports

**Type Checking:**

```bash
pnpm typecheck        # Check types without building
pnpm build            # Build and check types
```

**Common Type Errors:**

1. Missing `.js` extension in imports

   ```typescript
   // ❌ Wrong
   import { Foo } from './foo';

   // ✅ Correct
   import { Foo } from './foo.js';
   ```

2. Index access without checking

   ```typescript
   // ❌ Wrong (noUncheckedIndexedAccess)
   const value = obj[key];

   // ✅ Correct
   const value = obj[key];
   if (value !== undefined) {
     // Use value
   }
   ```

### Linting: ESLint

**Configuration:** `.eslintrc.cjs` or `eslint.config.*`

**What It Checks:**

- Code quality issues
- Potential bugs
- Style consistency
- Import order

**Commands:**

```bash
pnpm lint             # Check for issues
pnpm lint --fix       # Auto-fix issues
```

**Key Rules:**

- No `any` types in public APIs
- Explicit function return types
- No unused variables
- Consistent code style

**Integration:**

- Runs in pre-commit hook (via Husky)
- Runs in CI pipeline

### Formatting: Prettier

**Configuration:** `.prettierrc` or `prettier.config.js`

**What It Formats:**

- Code indentation and spacing
- Quote style
- Semicolons
- Line length

**Commands:**

```bash
pnpm format           # Format all files
pnpm format --check   # Check without changing
```

**Default Settings:**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 120
}
```

**Plugins:**

- `prettier-plugin-organize-imports` - Sorts imports

**Integration:**

- Runs in pre-commit hook
- Auto-formats on save (if configured in IDE)

### Testing: Vitest

**Configuration:** `vitest.config.ts`

**Test Structure:**

```
__tests__/
├── unit/              # Unit tests
│   ├── FetchApi.test.ts
│   └── types.test.ts
├── integration/       # Integration tests
│   └── petstore.test.ts
└── setup.ts           # Test setup
```

**Commands:**

```bash
pnpm test                 # Run all tests
pnpm test:unit            # Unit tests only
pnpm test:integration     # Integration tests only
pnpm test:coverage        # With coverage report
pnpm dev                  # Watch mode
```

**Coverage Thresholds:**

```typescript
{
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80
}
```

**Writing Tests:**

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Feature', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', () => {
    expect(true).toBe(true);
  });

  it('should handle async', async () => {
    const result = await asyncFunction();
    expect(result).toBeDefined();
  });
});
```

**Mocking:**

```typescript
import { vi } from 'vitest';

// Mock function
const mockFn = vi.fn();

// Mock module
vi.mock('./module', () => ({
  default: vi.fn(),
}));

// Mock global
global.fetch = vi.fn();
```

**Type Testing:**

```typescript
import { expectTypeOf } from 'vitest';

it('should infer correct type', () => {
  expectTypeOf(value).toBeString();
  expectTypeOf(value).toMatchTypeOf<ExpectedType>();
});
```

### Secret Detection: secretlint

**What It Does:**

- Scans code for accidentally committed secrets
- Checks for API keys, tokens, passwords, etc.

**Configuration:** `.secretlintrc.json`

**Commands:**

```bash
pnpm secretlint           # Scan all files
pnpm secretlint --fix     # Some auto-fixes available
```

**What It Detects:**

- AWS keys
- GitHub tokens
- Private keys
- Passwords in code
- Environment variable leaks

**False Positives:** Add to `.secretlintignore` if needed.

### Spell Checking: cspell

**What It Does:**

- Checks spelling in code and comments
- Custom dictionary support

**Configuration:** `cspell.json` or in `package.json`

**Commands:**

```bash
pnpm spellcheck          # Check spelling
```

**Custom Words:** Add project-specific words to config:

```json
{
  "words": ["petstore", "openapi", "vitest"]
}
```

---

## Build System

### Dual Output: CJS + ESM

Via builds two module formats for maximum compatibility:

**CommonJS (CJS):**

- Output: `dist/cjs/`
- For: Node.js `require()`
- Config: `tsconfig.build-cjs.json`

**ECMAScript Modules (ESM):**

- Output: `dist/mjs/`
- For: Modern `import`/`export`
- Config: `tsconfig.build-mjs.json`

### Build Process

```bash
# Full build
pnpm build

# What happens:
# 1. Run pnpm check (all quality checks)
# 2. Clean dist/
# 3. Build CJS: tsc -p tsconfig.build-cjs.json
# 4. Build ESM: tsc -p tsconfig.build-mjs.json
# 5. Add package.json to each output
# 6. Validate exports
```

**Post-Build:**

```bash
# Adds package.json markers
dist/cjs/package.json: {"type":"commonjs"}
dist/mjs/package.json: {"type":"module"}
```

### Package Exports

**package.json:**

```json
{
  "type": "module",
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

**Validation:**

```bash
pnpm validate  # Checks package exports are valid
```

### CLI Build

The CLI is also built and accessible via:

```bash
pnpm via        # Run locally
npx via         # Run from npm package
```

**Binary:**

```json
{
  "bin": {
    "via": "dist/mjs/cli/index.js"
  }
}
```

---

## Git Hooks: Husky

**Setup:** Runs automatically after `pnpm install`

### Pre-commit Hook

Runs before every commit:

1. **lint-staged** - Format and lint staged files

   ```bash
   # Configured in package.json
   "lint-staged": {
     "src/**/*.{js,jsx,ts,tsx}": [
       "prettier --write",
       "eslint --fix"
     ]
   }
   ```

2. **Staged files only** - Only checks what you're committing

### Commit-msg Hook

Validates commit message format:

**Format:** `type(scope?): subject`

**Valid Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Add/update tests
- `chore` - Maintenance

**Examples:**

```bash
✅ feat: add query parameter support
✅ fix: correct path substitution bug
✅ docs(readme): update installation steps
✅ refactor(types): simplify ApiReturn type
❌ Added feature  # Missing type
❌ feat add feature  # Missing colon
```

**Configuration:** `.commitlintrc.json` or `commitlint.config.js`

---

## Release Process: Semantic Release

**Automated versioning** based on commit messages.

### How It Works

1. Analyze commits since last release
2. Determine version bump (major/minor/patch)
3. Generate changelog
4. Create git tag
5. Publish to npm (if configured)

### Version Bumps

Based on commit types:

- `feat:` → Minor version (0.1.0 → 0.2.0)
- `fix:` → Patch version (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → Major version (0.1.0 → 1.0.0)

### Breaking Changes

Include `BREAKING CHANGE:` in commit body:

```bash
git commit -m "feat: change API signature

BREAKING CHANGE: apiMethod now requires second parameter"
```

### Configuration

**package.json:**

```json
{
  "version": "0.0.0-semantically-released",
  "scripts": {
    "semantic-release": "semantic-release"
  }
}
```

**Release Config:** `.releaserc` or `release.config.js`

### Manual Release

```bash
# Dry run (see what would happen)
npx semantic-release --dry-run

# Actual release (usually done in CI)
npx semantic-release
```

---

## CLI Development

### Structure

```
src/cli/
├── index.ts           # Entry point (interactive prompts)
├── generate.ts        # OpenAPI type generation
├── registry.ts        # Registry file creation
└── updateRegistry.ts  # Add entries to registry
```

### How It Works

1. **User runs:** `pnpm via`
2. **Prompts for:**
   - OpenAPI URL
   - Base URL (runtime)
   - Schema name
3. **Generates:**
   - `src/schema/{name}.ts` - TypeScript types
4. **Updates:**
   - `src/apiRegistry.ts` - Adds mapping

### Testing CLI

```bash
# Build first
pnpm build

# Run CLI
node dist/mjs/cli/index.js

# Or use the script
pnpm via
```

### CLI Dependencies

- **inquirer** - Interactive prompts
- **openapi-typescript** - Generate types from OpenAPI

---

## Common Tasks

### Add a New Feature

1. Create todo in `.kanban/to-do/`
2. Move to `in-progress/` when starting
3. Implement feature in `src/`
4. Write tests in `__tests__/`
5. Run `pnpm check`
6. Commit with `feat:` prefix
7. Move through kanban stages

### Fix a Bug

1. Write failing test first
2. Fix the bug
3. Verify test passes
4. Run `pnpm check`
5. Commit with `fix:` prefix

### Update Documentation

1. Update relevant `.md` files
2. Commit with `docs:` prefix
3. No version bump (docs don't trigger release)

### Add Dependencies

```bash
# Production dependency
pnpm add <package>

# Development dependency
pnpm add -D <package>
```

**Important:** Always specify version ranges carefully.

### Update Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update all to latest
pnpm update

# Update specific package
pnpm update <package>
```

---

## Troubleshooting

### Tests Failing

```bash
# Clear cache and rerun
pnpm test --no-cache

# Run specific test
pnpm test __tests__/path/to/test.ts

# Debug mode
node --inspect-brk node_modules/.bin/vitest
```

### Type Errors

```bash
# Clean and rebuild
rm -rf dist
pnpm build

# Check specific file
pnpm typecheck --noEmit

# VS Code: Reload TypeScript server
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Build Errors

```bash
# Clean everything
rm -rf dist node_modules
pnpm install
pnpm build

# Check for missing files
ls dist/cjs/
ls dist/mjs/
```

### Import Issues

**Problem:** `Cannot find module './foo'`

**Solution:** Add `.js` extension

```typescript
import { Foo } from './foo.js'; // Not './foo'
```

### Git Hook Issues

```bash
# Reinstall hooks
rm -rf .husky/_
pnpm prepare

# Skip hooks (emergency only)
git commit --no-verify
```

### Linting Issues

```bash
# Auto-fix what's possible
pnpm lint --fix

# Check specific file
pnpm eslint src/file.ts

# Disable rule for line (last resort)
// eslint-disable-next-line rule-name
```

### pnpm Issues

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall everything
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Quick Reference

```bash
# Development
pnpm dev                 # Watch mode
pnpm test                # Run tests
pnpm check               # All quality checks
pnpm build               # Build package

# Quality
pnpm lint                # Check linting
pnpm lint --fix          # Fix linting
pnpm format              # Format code
pnpm typecheck           # Check types

# Testing
pnpm test:unit           # Unit tests
pnpm test:integration    # Integration tests
pnpm test:coverage       # With coverage

# Package
pnpm via                 # Run CLI
pnpm validate            # Validate exports
```

---

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [pnpm Documentation](https://pnpm.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)

---

**Questions?** Check CLAUDE.md for project-specific guidance or ask in discussions.
