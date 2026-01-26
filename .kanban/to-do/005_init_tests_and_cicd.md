# 005 - Initialize Tests and CI/CD Pipelines

## 📋 Description

Set up comprehensive test suite and CI/CD pipelines to ensure code quality and catch regressions. Tests should cover:

1. **Unit Tests** - Via class methods, type utilities, CLI helpers
2. **Integration Tests** - Full workflow with real Petstore API
3. **Type Tests** - Verify TypeScript type inference works correctly
4. **CLI Tests** - Test schema generation and registry updates

Use Petstore API for realistic testing:

- **OpenAPI URL**: `https://petstore3.swagger.io/api/v3/openapi.json`
- **Base URL**: `https://petstore3.swagger.io/api/v3`

Test both scenarios:

- **Known schema** (Petstore - in registry)
- **Unknown schema** (untyped mode with generic API)

Set up CI/CD:

- Run on every push and PR
- Test matrix for Node 18, 20, 22
- Quality checks (lint, typecheck, test, build)
- Coverage reporting

## 🎯 Acceptance Criteria

### Tests

- [ ] Unit tests for Via class methods (GET, POST, PUT, DELETE)
- [ ] Unit tests for type utilities (`FilterRoutes`, `ApiBody`, `ApiReturn`)
- [ ] Integration test using real Petstore API
- [ ] CLI tests for schema generation
- [ ] CLI tests for registry updates
- [ ] Type tests verifying inference works
- [ ] Tests for typed mode (registry URLs)
- [ ] Tests for untyped mode (any URL)
- [ ] Test coverage >80%

### CI/CD

- [ ] GitHub Actions workflow configured
- [ ] Runs on push to main and PRs
- [ ] Tests on Node 18, 20, 22
- [ ] Quality checks pass (lint, typecheck, format)
- [ ] Build succeeds for both CJS and ESM
- [ ] Coverage report generated
- [ ] Status badge in README

## 🧪 How to Test

### Human Testing

1. Run test suite:

   ```bash
   pnpm test
   ```

   Expected: All tests pass

2. Check coverage:

   ```bash
   pnpm test:coverage
   ```

   Expected: >80% coverage

3. Run integration tests:

   ```bash
   pnpm test:integration
   ```

   Expected: Petstore API tests pass

4. Verify CI/CD:
   - Push to branch
   - Open PR
   - Check GitHub Actions runs
   - All checks should pass

### AI Testing

```bash
# Run all tests
pnpm test

# Check exit code
echo $?  # Should be 0

# Coverage check
pnpm test:coverage | grep "All files"
# Should show >80% coverage

# Verify CI config exists
test -f .github/workflows/ci.yml && echo "✓ CI config exists"
```

## ✅ When to Validate

Complete when:

1. Test suite runs successfully
2. Coverage exceeds 80%
3. CI/CD pipeline passes on GitHub
4. All acceptance criteria checked
5. Both typed and untyped modes are tested

## 🛠️ How to Implement

### Implementation Approach

1. **Create test structure**:

   ```
   __tests__/
   ├── unit/
   │   ├── Via.test.ts
   │   ├── types.test.ts
   │   └── cli.test.ts
   ├── integration/
   │   ├── petstore.test.ts
   │   └── cli-generation.test.ts
   └── setup.ts
   ```

2. **Write unit tests** for Via class
3. **Write integration tests** using Petstore API
4. **Write CLI tests** using temporary directories
5. **Set up GitHub Actions** workflow
6. **Configure coverage** reporting

### Difficulty

**Medium** - Requires understanding of Vitest, mocking, and CI/CD setup

### Key Files Involved

- `__tests__/unit/Via.test.ts` - Core class tests
- `__tests__/unit/types.test.ts` - Type utility tests
- `__tests__/unit/cli.test.ts` - CLI helper tests
- `__tests__/integration/petstore.test.ts` - Real API tests
- `__tests__/integration/cli-generation.test.ts` - Full CLI workflow
- `__tests__/setup.ts` - Test configuration
- `.github/workflows/ci.yml` - CI/CD pipeline
- `vitest.config.ts` - Vitest configuration

### Attention Points

1. **API Rate Limits**: Petstore API may have rate limits, use sparingly or mock

   ```typescript
   // Use real API for integration tests
   // Use MSW or fetch mocks for unit tests
   ```

2. **Temporary Files**: CLI tests need temporary directories

   ```typescript
   import { mkdtempSync, rmSync } from 'fs';
   import { tmpdir } from 'os';

   const testDir = mkdtempSync(path.join(tmpdir(), 'via-test-'));
   // ... run tests
   rmSync(testDir, { recursive: true });
   ```

3. **Type Tests**: TypeScript type tests don't run, they compile

   ```typescript
   // These are compile-time checks
   // @ts-expect-error - This should fail
   const invalid = new Via('https://unknown.com');
   ```

4. **Async Tests**: Use proper async/await patterns

   ```typescript
   it('should fetch data', async () => {
     const result = await api.get('/endpoint');
     expect(result).toBeDefined();
   });
   ```

5. **CI Environment**: Use environment variables for configuration

   ```yaml
   env:
     NODE_ENV: test
     CI: true
   ```

6. **Coverage Thresholds**: Configure in `vitest.config.ts`
   ```typescript
   coverage: {
     provider: 'v8',
     reporter: ['text', 'json', 'html'],
     lines: 80,
     functions: 80,
     branches: 80,
     statements: 80
   }
   ```

### Implementation Steps

#### 1. Create Unit Tests for Via Class

```typescript
// __tests__/unit/Via.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Via from '../../src/Via.js';

// Mock fetch
global.fetch = vi.fn();

describe('Via Class', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Typed Mode', () => {
    it('should create instance with registered URL', () => {
      const api = new Via('https://petstore3.swagger.io/api/v3');
      expect(api).toBeDefined();
    });

    it('should make GET request', async () => {
      const mockResponse = { id: 1, name: 'Rex' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const api = new Via('https://petstore3.swagger.io/api/v3');
      const result = await api.get('/pet/1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/api/v3/pet/1',
        expect.objectContaining({
          method: 'GET',
          headers: { Accept: 'application/json' },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should make POST request with body', async () => {
      const mockResponse = { id: 2, name: 'Max' };
      const requestBody = { name: 'Max', photoUrls: [] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const api = new Via('https://petstore3.swagger.io/api/v3');
      const result = await api.post('/pet', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/api/v3/pet',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on non-ok response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const api = new Via('https://petstore3.swagger.io/api/v3');

      await expect(api.get('/pet/999999')).rejects.toThrow('API Error');
    });
  });

  describe('Untyped Mode', () => {
    it('should create instance with any URL', () => {
      const api = new Via('https://unknown-api.com', { typed: false });
      expect(api).toBeDefined();
    });

    it('should make request with generic type', async () => {
      interface User {
        id: number;
        name: string;
      }

      const mockResponse: User = { id: 1, name: 'Alice' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const api = new Via('https://unknown-api.com', { typed: false });
      const result = await api.get<User>('/users/1');

      expect(result).toEqual(mockResponse);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Alice');
    });
  });
});
```

#### 2. Create Integration Test with Petstore API

```typescript
// __tests__/integration/petstore.test.ts

import { describe, it, expect } from 'vitest';
import Via from '../../src/Via.js';

describe('Petstore API Integration', () => {
  const api = new Via('https://petstore3.swagger.io/api/v3');

  it('should fetch available pets', async () => {
    const pets = await api.get('/pet/findByStatus?status=available');

    expect(Array.isArray(pets)).toBe(true);
    expect(pets.length).toBeGreaterThan(0);

    const pet = pets[0];
    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('name');
  });

  it('should handle errors gracefully', async () => {
    await expect(api.get('/pet/999999999')).rejects.toThrow('API Error');
  });
});
```

#### 3. Create CLI Tests

```typescript
// __tests__/integration/cli-generation.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI Schema Generation', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(path.join(tmpdir(), 'via-cli-test-'));
    process.chdir(testDir);
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('should generate schema from OpenAPI URL', async () => {
    // Run CLI with automated input
    const input = [
      'openapi',
      'https://petstore3.swagger.io/api/v3/openapi.json',
      'https://petstore3.swagger.io/api/v3',
      'petstoreSchema',
    ].join('\n');

    await execAsync(`echo "${input}" | npx via`, {
      cwd: testDir,
    });

    // Verify files were created
    expect(existsSync(path.join(testDir, 'src/schema/petstoreSchema.ts'))).toBe(true);
    expect(existsSync(path.join(testDir, 'src/apiRegistry.ts'))).toBe(true);

    // Verify registry content
    const registry = readFileSync(path.join(testDir, 'src/apiRegistry.ts'), 'utf-8');
    expect(registry).toContain('petstoreSchema');
    expect(registry).toContain('https://petstore3.swagger.io/api/v3');
  });
});
```

#### 4. Set Up GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test on Node ${{ matrix.node-version }}
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9.6.0

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run format check
        run: pnpm format --check

      - name: Run linter
        run: pnpm lint

      - name: Run type check
        run: pnpm typecheck

      - name: Run secret lint
        run: pnpm secretlint

      - name: Run spell check
        run: pnpm spellcheck

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.node-version == 20
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

      - name: Build
        run: pnpm build

      - name: Validate exports
        run: pnpm validate

  integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9.6.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run integration tests
        run: pnpm test:integration
```

#### 5. Update Vitest Config

```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/cli/**/*', // CLI tested separately
        'src/schema/**/*', // Generated files
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    include: ['__tests__/unit/**/*.test.ts', '__tests__/integration/**/*.test.ts'],
  },
});
```

#### 6. Add Coverage Badge to README

```markdown
<!-- In README.md -->

[![npm version](https://img.shields.io/npm/v/@jeportie/via.svg)](https://www.npmjs.com/package/@jeportie/via) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/) [![Coverage](https://codecov.io/gh/jeportie/via/branch/main/graph/badge.svg)](https://codecov.io/gh/jeportie/via) [![CI](https://github.com/jeportie/via/workflows/CI/badge.svg)](https://github.com/jeportie/via/actions)
```

## 📚 Context & References

- Vitest docs: https://vitest.dev/
- GitHub Actions: https://docs.github.com/en/actions
- Petstore API: https://petstore3.swagger.io/
- Coverage reporting: https://about.codecov.io/
- Current test setup: `__tests__/setup.ts`
- Package test scripts: `package.json` lines 59-63

## 🔗 Dependencies

Should be done after:

- 001 - Rename FetchApi to Via
- 002 - Verify user file generation (needed for CLI tests)
- 003 - Fix linting issues
- 004 - Add untyped mode (to test both modes)

This is the final todo that validates all previous work.
