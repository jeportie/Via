# 004 - Add Untyped Mode Flag

## 📋 Description

Add support for untyped mode to allow Via to work as a standard fetch wrapper for APIs that aren't in the registry. This enables Via to be used in two modes:

**Typed Mode (default)**: Base URL must be in registry, full type safety

```typescript
const api = new Via('https://petstore3.swagger.io/api/v3'); // Must be registered
const pet = await api.get('/pet/123'); // Full type inference
```

**Untyped Mode (opt-in)**: Any base URL, developer provides types

```typescript
const api = new Via('https://unknown-api.com', { typed: false });
const data = await api.get<MyType>('/endpoint'); // Generic type parameter
```

This requires architectural decisions:

- How to handle the constructor overload?
- Should untyped mode use a separate class or conditional types?
- How to maintain type safety for typed mode while allowing flexibility?

## 🎯 Acceptance Criteria

- [ ] Constructor accepts optional config with `typed` flag
- [ ] Typed mode (default) requires base URL in `ApiRegistry`
- [ ] Untyped mode accepts any base URL
- [ ] Untyped mode allows generic type parameters on methods
- [ ] Type safety is maintained in typed mode
- [ ] Untyped mode returns `unknown` or accepts generic `<T>`
- [ ] No breaking changes to existing typed API
- [ ] Documentation explains both modes
- [ ] Tests cover both typed and untyped scenarios

## 🧪 How to Test

### Human Testing

**Typed Mode:**

```typescript
import { Via } from '@jeportie/via';

// Should compile (URL in registry)
const api = new Via('https://petstore3.swagger.io/api/v3');
const pet = await api.get('/pet/123');
//    ^? Pet type inferred

// Should NOT compile (URL not in registry)
const invalid = new Via('https://unknown-api.com');
//    ^ TypeScript error
```

**Untyped Mode:**

```typescript
import { Via } from '@jeportie/via';

// Should compile (untyped mode)
const api = new Via('https://unknown-api.com', { typed: false });

// Returns unknown, or accepts generic
const data = await api.get<User>('/users/123');
//    ^? User type

// Or returns unknown
const raw = await api.get('/data');
//    ^? unknown
```

### AI Testing

```typescript
// __tests__/untyped-mode.test.ts

describe('Via - Untyped Mode', () => {
  it('should allow any base URL in untyped mode', () => {
    const api = new Via('https://unknown-api.com', { typed: false });
    expect(api).toBeDefined();
  });

  it('should accept generic type parameters', async () => {
    const api = new Via('https://jsonplaceholder.typicode.com', { typed: false });

    interface User {
      id: number;
      name: string;
    }

    const user = await api.get<User>('/users/1');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
  });

  it('should reject unknown URLs in typed mode', () => {
    // This should fail TypeScript compilation
    // @ts-expect-error - URL not in registry
    const api = new Via('https://unknown-api.com');
  });
});
```

## ✅ When to Validate

Complete when:

1. Both typed and untyped modes work correctly
2. Type safety is maintained in typed mode
3. Untyped mode provides flexibility without errors
4. Tests pass for both modes
5. TypeScript compilation enforces constraints correctly

## 🛠️ How to Implement

### Implementation Approach

**Option A: Constructor Overload** (Recommended)

```typescript
class Via<D extends keyof ApiRegistry> {
  constructor(baseUrl: D);
  constructor(baseUrl: string, config: { typed: false });
  constructor(baseUrl: string, config?: { typed?: boolean }) {
    // Implementation
  }
}
```

**Option B: Separate Classes**

```typescript
class Via<D extends keyof ApiRegistry> {
  /* typed */
}
class UntypedVia {
  /* untyped */
}
```

**Option C: Conditional Types** (Most flexible)

```typescript
type ViaConfig<T extends boolean> = { typed: T };

class Via<D extends string = string, Typed extends boolean = true> {
  constructor(
    baseUrl: Typed extends true ? (D extends keyof ApiRegistry ? D : never) : string,
    config?: ViaConfig<Typed>,
  );
}
```

### Difficulty

**Hard** - Requires careful TypeScript generic design and type constraints

### Key Files Involved

- `src/Via.ts` - Main class implementation
  - Add constructor overload or conditional types
  - Add config parameter handling
  - Update method signatures for untyped mode

- `src/types.ts` - Type utilities
  - Add `ViaConfig` type
  - Add conditional return types for untyped mode
  - Create `UntypedReturn<T>` helper

- `src/index.ts` - Exports
  - Export config types
  - Document usage patterns

- `__tests__/untyped-mode.test.ts` - New test file
  - Test untyped mode initialization
  - Test generic type parameters
  - Test typed mode enforcement

### Attention Points

1. **Type safety preservation**: Typed mode must remain strictly typed

   ```typescript
   // Must still error:
   const api = new Via('https://unknown-api.com'); // ❌
   ```

2. **Generic constraints**: Untyped methods need optional generic parameters

   ```typescript
   get<T = unknown>(endpoint: string): Promise<T>
   ```

3. **Runtime vs compile-time**: Base URL validation only happens at compile time for typed mode

4. **Config handling**: Config object should be optional and have sensible defaults

   ```typescript
   {
     typed: true;
   } // default
   ```

5. **Backward compatibility**: Existing typed usage must work unchanged

   ```typescript
   const api = new Via('https://registered-url.com'); // Still works
   ```

6. **Method signatures**: In untyped mode, endpoints are just `string`, not constrained

   ```typescript
   // Typed mode:
   get<E extends FilterRoutes<...>>(endpoint: E)

   // Untyped mode:
   get<T = unknown>(endpoint: string): Promise<T>
   ```

### Implementation Steps

1. **Design the type system** (Requires discussion):

   Let's discuss which approach to use. Here are pros/cons:

   **Constructor Overload** (Recommended):
   - ✅ Simple to understand
   - ✅ Minimal code changes
   - ✅ Clear separation
   - ❌ Harder to maintain two signatures

   **Conditional Types**:
   - ✅ Most flexible
   - ✅ Single implementation
   - ❌ Complex type signature
   - ❌ Harder to debug type errors

   **Separate Classes**:
   - ✅ Complete separation
   - ✅ Easier to maintain
   - ❌ Code duplication
   - ❌ Two classes to document

2. **Implement chosen approach**:

   Example with **Constructor Overload** (recommended):

   ```typescript
   // src/Via.ts

   import type { ApiRegistry } from './apiRegistry.js';
   import type { ApiBody, ApiReturn, FilterRoutes, HttpMethods, EndpointKey } from './types.js';

   export type ViaConfig = {
     typed?: boolean;
   };

   export default class Via<D extends keyof ApiRegistry | string = string> {
     #baseUrl: string;
     #typed: boolean;

     // Typed mode constructor
     constructor(baseUrl: D extends keyof ApiRegistry ? D : never);

     // Untyped mode constructor
     constructor(baseUrl: string, config: { typed: false });

     // Implementation
     constructor(baseUrl: string, config?: ViaConfig) {
       this.#baseUrl = baseUrl;
       this.#typed = config?.typed ?? true;

       // Optionally warn in development
       if (this.#typed && !(baseUrl in ({} as ApiRegistry))) {
         console.warn(
           `[Via] Base URL "${baseUrl}" not found in ApiRegistry. ` + `Consider adding it or use { typed: false }.`,
         );
       }
     }

     // Typed mode methods (when D extends keyof ApiRegistry)
     get<E extends D extends keyof ApiRegistry ? FilterRoutes<ApiRegistry[D], 'GET'> : never>(
       endpoint: E,
     ): Promise<D extends keyof ApiRegistry ? ApiReturn<ApiRegistry[D], E, 'GET'> : never>;

     // Untyped mode methods (when typed: false)
     get<T = unknown>(endpoint: string): Promise<T>;

     // Implementation
     get<E extends string, T = unknown>(
       endpoint: E,
     ): Promise<T | ApiReturn<ApiRegistry[D & keyof ApiRegistry], E, 'GET'>> {
       return this.#request(endpoint, 'GET');
     }

     // Similar for post, put, delete...

     async #request<T = unknown>(endpoint: string, method: HttpMethods, body?: unknown): Promise<T> {
       const url = this.#baseUrl + endpoint;

       const options: RequestInit = {
         method,
         headers: {
           Accept: 'application/json',
         },
       };

       if (body !== undefined) {
         options.headers = {
           ...options.headers,
           'Content-Type': 'application/json',
         };
         options.body = JSON.stringify(body);
       }

       const response = await fetch(url, options);

       if (!response.ok) {
         throw new Error(`[API Error]: ${response.status} from ${endpoint}`);
       }

       return response.json() as Promise<T>;
     }
   }
   ```

3. **Add type tests** to verify behavior:

   ```typescript
   // __tests__/type-tests.test.ts

   import { Via } from '../src/index.js';

   describe('Via Type Tests', () => {
     it('should enforce registry URLs in typed mode', () => {
       // Valid: URL in registry
       const api = new Via('https://petstore3.swagger.io/api/v3');

       // Invalid: URL not in registry (TypeScript error)
       // @ts-expect-error
       const invalid = new Via('https://unknown-api.com');
     });

     it('should allow any URL in untyped mode', () => {
       const api = new Via('https://any-url.com', { typed: false });
       expect(api).toBeDefined();
     });
   });
   ```

4. **Update documentation** in README (already done, verify examples)

5. **Add JSDoc comments**:

   ````typescript
   /**
    * Via - Type-safe fetch wrapper for TypeScript
    *
    * @example Typed mode (default)
    * ```typescript
    * const api = new Via('https://api.example.com');
    * const data = await api.get('/endpoint');  // Fully typed
    * ```
    *
    * @example Untyped mode
    * ```typescript
    * const api = new Via('https://any-api.com', { typed: false });
    * const data = await api.get<MyType>('/endpoint');
    * ```
    */
   export default class Via<D extends keyof ApiRegistry | string = string> {
     // ...
   }
   ````

## 📚 Context & References

- README already documents both modes (lines 163-182)
- Plan document discusses three options (Constructor flag, Separate classes, etc.)
- TypeScript handbook on function overloads: https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads

## 🔗 Dependencies

Should be done after:

- 001 - Rename FetchApi to Via
- 003 - Fix linting issues (to have clean base)

Required for:

- 005 - Init tests (needs both modes to test)
