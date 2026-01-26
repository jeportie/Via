# 000 - Create Tests for Existing Code

## 📋 Description

Create comprehensive test suite for the existing codebase before starting refactoring. This ensures we don't break functionality when implementing todos 001-005.

**Current code to test:**

- `src/FetchApi.ts` - Main client class (GET, POST, PUT, DELETE methods)
- `src/types.ts` - Type utilities (FilterRoutes, ApiBody, ApiReturn, ApiParams)
- `src/cli/` - CLI tools (generate.ts, registry.ts, updateRegistry.ts)
- `src/index.ts` - Exports

**Coverage target:** >80% for all source files

## 🎯 Acceptance Criteria

- [ ] Unit tests for FetchApi class methods
- [ ] Unit tests for type utilities (type-level tests)
- [ ] Integration test with real Petstore API
- [ ] CLI generation tests (with mocked file system)
- [ ] Test coverage >80%
- [ ] All tests pass
- [ ] Tests run in CI (when CI is set up)
- [ ] Test documentation in DEV.md

## 🧪 How to Test

### Human Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Check coverage report
open coverage/index.html

# Verify coverage >80%
# All files in src/ should be covered
```

### AI Testing

```bash
# Automated test validation
pnpm test:coverage

# Check exit code
echo $?  # Should be 0

# Verify coverage threshold
grep -A 5 "All files" coverage/lcov-report/index.html
```

## ✅ When to Validate

Complete when:

1. All acceptance criteria checked
2. Coverage report shows >80% for all src/ files
3. All tests pass consistently
4. Tests are documented in DEV.md
5. User approves test quality

## 🛠️ How to Implement

### Implementation Approach

Write tests using Vitest (already configured). Focus on:

1. **Unit tests** - Test individual functions/methods in isolation
2. **Type tests** - Verify TypeScript inference works correctly
3. **Integration tests** - Test real API calls (Petstore)
4. **CLI tests** - Test file generation with temp directories

**Test structure:**

```
__tests__/
├── unit/
│   ├── FetchApi.test.ts       # Client methods
│   ├── types.test.ts          # Type utilities
│   └── cli.test.ts            # CLI helpers
├── integration/
│   ├── petstore.test.ts       # Real API
│   └── cli-generation.test.ts # Full CLI workflow
└── setup.ts                   # Test configuration
```

### Difficulty

**Medium** - Requires understanding of Vitest, mocking, and type testing

### Key Files Involved

**Files to Create:**

- `__tests__/unit/FetchApi.test.ts` - Test client methods
- `__tests__/unit/types.test.ts` - Test type utilities
- `__tests__/unit/cli.test.ts` - Test CLI helpers
- `__tests__/integration/petstore.test.ts` - Test real API
- `__tests__/integration/cli-generation.test.ts` - Test full workflow

**Files to Test:**

- `src/FetchApi.ts` - Main client (currently ~70 lines)
- `src/types.ts` - Type utilities (currently ~48 lines)
- `src/cli/index.ts` - CLI entry point
- `src/cli/generate.ts` - Schema generation
- `src/cli/registry.ts` - Registry management
- `src/cli/updateRegistry.ts` - Registry updates

**Files to Update:**

- `vitest.config.ts` - Configure coverage thresholds
- `DEV.md` - Document testing approach (to be created)

### Attention Points

1. **Mocking fetch**: Global fetch needs to be mocked for unit tests

   ```typescript
   import { vi } from 'vitest';
   global.fetch = vi.fn();
   ```

2. **Type testing**: TypeScript types don't run, they compile

   ```typescript
   // Use @ts-expect-error to test compile-time errors
   // @ts-expect-error - Should fail
   const invalid = new FetchApi('https://unknown.com');
   ```

3. **API rate limits**: Petstore API may have rate limits
   - Use sparingly in integration tests
   - Consider caching responses
   - Or mock responses for most tests

4. **CLI file system**: Test CLI in isolated temp directories

   ```typescript
   import { mkdtempSync, rmSync } from 'fs';
   const testDir = mkdtempSync(path.join(tmpdir(), 'via-test-'));
   // ... run tests
   rmSync(testDir, { recursive: true });
   ```

5. **Async operations**: Use proper async/await

   ```typescript
   it('should fetch data', async () => {
     const result = await api.get('/endpoint');
     expect(result).toBeDefined();
   });
   ```

6. **Coverage config**: Set in vitest.config.ts
   ```typescript
   coverage: {
     lines: 80,
     functions: 80,
     branches: 80,
     statements: 80,
     include: ['src/**/*.ts'],
     exclude: ['src/**/*.test.ts', 'src/schema/**']
   }
   ```

### Implementation Steps

#### Step 1: Create Unit Tests for FetchApi

```typescript
// __tests__/unit/FetchApi.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import FetchApi from '../../src/FetchApi.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('FetchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make GET request with correct URL and headers', async () => {
      const mockResponse = { id: 1, name: 'Test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const api = new FetchApi('https://petstore3.swagger.io/api/v3');
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

    it('should throw error on non-ok response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const api = new FetchApi('https://petstore3.swagger.io/api/v3');

      await expect(api.get('/pet/999999')).rejects.toThrow('API Error');
    });
  });

  describe('POST requests', () => {
    it('should make POST request with body', async () => {
      const mockResponse = { id: 2, name: 'Created' };
      const requestBody = { name: 'Test', photoUrls: [] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const api = new FetchApi('https://petstore3.swagger.io/api/v3');
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
  });

  describe('PUT requests', () => {
    it('should make PUT request with body', async () => {
      const mockResponse = { id: 1, name: 'Updated' };
      const requestBody = { id: 1, name: 'Updated', photoUrls: [] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const api = new FetchApi('https://petstore3.swagger.io/api/v3');
      const result = await api.put('/pet', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/api/v3/pet',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestBody),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const api = new FetchApi('https://petstore3.swagger.io/api/v3');
      await api.delete('/pet/1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://petstore3.swagger.io/api/v3/pet/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });
});
```

#### Step 2: Create Type Tests

```typescript
// __tests__/unit/types.test.ts

import { describe, it, expectTypeOf } from 'vitest';
import type { ApiRegistry } from '../../src/apiRegistry.js';
import type { FilterRoutes, ApiBody, ApiReturn } from '../../src/types.js';

describe('Type System', () => {
  describe('FilterRoutes', () => {
    it('should filter GET routes', () => {
      type GetRoutes = FilterRoutes<ApiRegistry['https://petstore3.swagger.io/api/v3'], 'GET'>;

      // Type test: this should compile
      const validRoute: GetRoutes = '/pet/findByStatus';
      expectTypeOf(validRoute).toBeString();
    });

    it('should filter POST routes', () => {
      type PostRoutes = FilterRoutes<ApiRegistry['https://petstore3.swagger.io/api/v3'], 'POST'>;

      const validRoute: PostRoutes = '/pet';
      expectTypeOf(validRoute).toBeString();
    });
  });

  describe('ApiBody', () => {
    it('should extract request body type', () => {
      type PetBody = ApiBody<ApiRegistry['https://petstore3.swagger.io/api/v3'], '/pet', 'POST'>;

      // Type test: body should have expected shape
      expectTypeOf<PetBody>().toMatchTypeOf<{ name: string; photoUrls: string[] }>();
    });
  });

  describe('ApiReturn', () => {
    it('should extract response type', () => {
      type PetResponse = ApiReturn<ApiRegistry['https://petstore3.swagger.io/api/v3'], '/pet', 'POST'>;

      // Type test: response should have expected shape
      expectTypeOf<PetResponse>().toMatchTypeOf<{ id?: number; name: string }>();
    });
  });
});
```

#### Step 3: Create Integration Tests

```typescript
// __tests__/integration/petstore.test.ts

import { describe, it, expect } from 'vitest';
import FetchApi from '../../src/FetchApi.js';

describe('Petstore API Integration', () => {
  const api = new FetchApi('https://petstore3.swagger.io/api/v3');

  it('should fetch pet by ID', async () => {
    // Use a known pet ID (1 usually exists)
    const pet = await api.get('/pet/1');

    expect(pet).toBeDefined();
    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('name');
  });

  it('should create a new pet', async () => {
    const newPet = {
      name: 'TestPet' + Date.now(),
      photoUrls: ['https://example.com/photo.jpg'],
      status: 'available',
    };

    const created = await api.post('/pet', newPet);

    expect(created).toBeDefined();
    expect(created.name).toBe(newPet.name);
  });

  it('should handle 404 errors', async () => {
    await expect(api.get('/pet/999999999')).rejects.toThrow('API Error');
  });
});
```

#### Step 4: Create CLI Tests

```typescript
// __tests__/unit/cli.test.ts

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

describe('CLI Registry Management', () => {
  it('should have registry file', () => {
    const registryPath = path.resolve('src/apiRegistry.ts');
    expect(existsSync(registryPath)).toBe(true);
  });

  it('should export ApiRegistry interface', () => {
    const registryPath = path.resolve('src/apiRegistry.ts');
    const content = readFileSync(registryPath, 'utf-8');

    expect(content).toContain('export interface ApiRegistry');
  });
});
```

#### Step 5: Configure Coverage

```typescript
// vitest.config.ts (update)

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
        'src/schema/**/*', // Generated files
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

#### Step 6: Run Tests and Verify Coverage

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage

# Check coverage report
open coverage/index.html

# Verify all files covered
```

## 📚 Context & References

- Current tests: `__tests__/setup.ts` (minimal)
- Vitest config: `vitest.config.ts`
- Package scripts: `package.json` (test commands)
- Source files: `src/` (what needs testing)

## 🔗 Dependencies

None - This should be done first before any refactoring (todos 001-005)

## 📝 Notes

**Why Priority 000?** Testing existing code ensures we don't break functionality during refactoring. This is foundational work.

**Integration Tests:**

- Use real Petstore API sparingly
- Consider mocking for most tests
- Rate limits may apply

**After This Todo:**

- Move to `to-test/` when tests written
- Run `pnpm test:coverage` to verify
- Move to `analyze/` for review
- Move to `done/` when approved
- Then start todo 001 (rename FetchApi)
