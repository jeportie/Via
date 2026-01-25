# 003 - Fix Linting Issues

## 📋 Description

Fix all current linting issues in the codebase, specifically:

1. **Missing return types** on public methods (Via class methods: `get`, `post`, `put`, `delete`)
2. **Explicit any types** if present
3. **Unused variables** or imports
4. **ESLint warnings/errors**

Public API methods should have explicit return types for better IntelliSense and type clarity:

```typescript
// Before:
get<E extends FilterRoutes<ApiRegistry[D], 'GET'>>(endpoint: E) {
  return this.#request(endpoint, 'GET');
}

// After:
get<E extends FilterRoutes<ApiRegistry[D], 'GET'>>(
  endpoint: E
): Promise<ApiReturn<ApiRegistry[D], E, 'GET'>> {
  return this.#request(endpoint, 'GET');
}
```

## 🎯 Acceptance Criteria

- [ ] All public methods have explicit return types
- [ ] `pnpm lint` passes with zero warnings
- [ ] `pnpm typecheck` passes with zero errors
- [ ] No `any` types in public API surface
- [ ] No unused imports or variables
- [ ] Code follows project's ESLint rules
- [ ] Consistent formatting with Prettier

## 🧪 How to Test

### Human Testing

1. Run linting:
   ```bash
   pnpm lint
   ```
   Expected: "0 errors, 0 warnings"

2. Run type checking:
   ```bash
   pnpm typecheck
   ```
   Expected: No TypeScript errors

3. Check formatting:
   ```bash
   pnpm format
   ```
   Expected: No changes needed

4. Verify in IDE: Hover over method calls, should show explicit return types

### AI Testing

```bash
# Run all quality checks
pnpm check

# Individual checks
pnpm lint
pnpm typecheck
pnpm format

# Verify no console output indicates issues
echo $?  # Should be 0
```

## ✅ When to Validate

Complete when:
1. `pnpm check` passes completely
2. All acceptance criteria are checked
3. IDE shows clear return types on hover
4. No warnings in terminal output

## 🛠️ How to Implement

### Implementation Approach

1. Add explicit return types to all public methods in Via class
2. Run ESLint with `--fix` flag to auto-fix what's possible
3. Manually fix remaining issues
4. Run formatter to ensure consistency

### Difficulty
**Easy** - Mostly mechanical fixes with clear patterns

### Key Files Involved

- `src/Via.ts` (formerly `FetchApi.ts`) - Add return types to methods
  - `get()` method
  - `post()` method
  - `put()` method
  - `delete()` method

- `src/cli/**/*.ts` - Fix any CLI linting issues
- `src/types.ts` - Verify type utilities are lint-clean
- `__tests__/**/*.test.ts` - Fix test linting issues

### Attention Points

1. **Return type complexity**: The return types use advanced generics
   ```typescript
   Promise<ApiReturn<ApiRegistry[D], E, M>>
   ```
   Must match exactly with the `#request` method's return type

2. **Method overloads**: If methods have different signatures, ensure return types are correct for each

3. **Private methods**: Don't need explicit return types (TypeScript infers), but can add for clarity

4. **Type imports**: May need to add type imports if not already present
   ```typescript
   import type { ApiBody, ApiReturn, FilterRoutes } from './types.js';
   ```

5. **Async/Promise**: Ensure `Promise<T>` wrapper is present for async methods

6. **Optional parameters**: Body parameters might be optional, handle correctly
   ```typescript
   post<E extends FilterRoutes<ApiRegistry[D], 'POST'>>(
     endpoint: E,
     body: ApiBody<ApiRegistry[D], E, 'POST'>
   ): Promise<ApiReturn<ApiRegistry[D], E, 'POST'>>
   ```

### Implementation Steps

1. **Add return types to Via class methods**:

   ```typescript
   // src/Via.ts (after rename from FetchApi.ts)

   import type {
     ApiBody,
     ApiReturn,
     EndpointKey,
     FilterRoutes,
     HttpMethods
   } from './types.js';
   import type { ApiRegistry } from './apiRegistry.js';

   export default class Via<D extends keyof ApiRegistry> {
     #baseUrl: D;

     constructor(baseUrl: D) {
       this.#baseUrl = baseUrl;
     }

     get<E extends FilterRoutes<ApiRegistry[D], 'GET'>>(
       endpoint: E
     ): Promise<ApiReturn<ApiRegistry[D], E, 'GET'>> {
       return this.#request(endpoint, 'GET');
     }

     post<E extends FilterRoutes<ApiRegistry[D], 'POST'>>(
       endpoint: E,
       body: ApiBody<ApiRegistry[D], E, 'POST'>
     ): Promise<ApiReturn<ApiRegistry[D], E, 'POST'>> {
       return this.#request(endpoint, 'POST', body);
     }

     put<E extends FilterRoutes<ApiRegistry[D], 'PUT'>>(
       endpoint: E,
       body: ApiBody<ApiRegistry[D], E, 'PUT'>
     ): Promise<ApiReturn<ApiRegistry[D], E, 'PUT'>> {
       return this.#request(endpoint, 'PUT', body);
     }

     delete<E extends FilterRoutes<ApiRegistry[D], 'DELETE'>>(
       endpoint: E
     ): Promise<ApiReturn<ApiRegistry[D], E, 'DELETE'>> {
       return this.#request(endpoint, 'DELETE');
     }

     async #request<E extends EndpointKey<ApiRegistry[D]>, M extends HttpMethods>(
       endpoint: E,
       method: M,
       body?: ApiBody<ApiRegistry[D], E, M>
     ): Promise<ApiReturn<ApiRegistry[D], E, M>> {
       // ... existing implementation
     }
   }
   ```

2. **Run ESLint auto-fix**:
   ```bash
   pnpm lint --fix
   ```

3. **Fix remaining issues manually**:
   - Check ESLint output for any remaining errors
   - Fix unused imports
   - Fix any `any` types
   - Address any rule violations

4. **Run formatter**:
   ```bash
   pnpm format
   ```

5. **Verify all checks pass**:
   ```bash
   pnpm check
   ```

6. **Test in IDE**:
   - Open `src/Via.ts`
   - Hover over method names
   - Verify return types are shown clearly

## 📚 Context & References

- ESLint config: `.eslintrc.cjs` or `eslint.config.*`
- TypeScript config: `tsconfig.json`
- Current linting script: `package.json` line 55
- Type definitions: `src/types.ts`

## 🔗 Dependencies

Should be done after:
- 001 - Rename FetchApi to Via (to avoid renaming twice)
