# 001 - Rename FetchApi to Via

## 📋 Description

Rename the `FetchApi` class to `Via` throughout the codebase to match the package name and improve branding consistency. This includes:
- Class name in `src/FetchApi.ts`
- File name itself
- All imports and exports
- Type references
- Documentation
- Test files

The main export should be `Via` so users can write:
```typescript
import { Via } from '@jeportie/via';
const api = new Via('https://api.example.com');
```

## 🎯 Acceptance Criteria

- [ ] `src/FetchApi.ts` renamed to `src/Via.ts`
- [ ] Class name changed from `FetchApi` to `Via`
- [ ] `src/index.ts` exports `Via` as default and named export
- [ ] All internal imports updated
- [ ] All test files updated to use `Via`
- [ ] No references to `FetchApi` remain in codebase
- [ ] TypeScript compilation succeeds
- [ ] All tests pass
- [ ] README examples use `Via` class name

## 🧪 How to Test

### Human Testing
1. Search codebase for "FetchApi" - should find zero results
2. Search codebase for "fetchApi" - should find zero results
3. Run `pnpm typecheck` - should succeed
4. Run `pnpm build` - should succeed
5. Import in a test project: `import { Via } from '@jeportie/via'` - should work

### AI Testing
```bash
# Search for any remaining references
grep -r "FetchApi" src/ __tests__/
grep -r "fetchApi" src/ __tests__/

# Type check
pnpm typecheck

# Run tests
pnpm test

# Build
pnpm build
```

## ✅ When to Validate

Complete when:
1. All acceptance criteria are checked
2. No "FetchApi" references remain in source code
3. TypeScript compilation and tests pass
4. README shows correct class name

## 🛠️ How to Implement

### Implementation Approach

This is a straightforward rename refactor:
1. Rename file: `src/FetchApi.ts` → `src/Via.ts`
2. Change class declaration: `class FetchApi` → `class Via`
3. Update `src/index.ts` to export `Via`
4. Update all imports across codebase
5. Update tests to import and use `Via`
6. Verify no lingering references

### Difficulty
**Easy** - Mechanical refactor with search-and-replace

### Key Files Involved

- `src/FetchApi.ts` → `src/Via.ts` - Rename file and class
- `src/index.ts` - Update exports
- `src/types.ts` - May have type references (verify)
- `__tests__/**/*.test.ts` - Update test imports and usage
- `README.md` - Update code examples (already done, verify)

### Attention Points

1. **Case sensitivity**: "FetchApi", "fetchApi", "FetchAPI" - check all variants
2. **Import paths**: Ensure `.js` extension in imports (ESM requirement)
3. **Type exports**: Make sure both type and value exports work:
   ```typescript
   export default Via;
   export { Via };
   export type { Via };
   ```
4. **Backward compatibility**: This is a breaking change for early adopters (acceptable for v0.x)
5. **Documentation**: Update inline JSDoc comments if they reference the old name

### Implementation Steps

1. Rename the file:
   ```bash
   mv src/FetchApi.ts src/Via.ts
   ```

2. Update class name in `src/Via.ts`:
   ```typescript
   // Before:
   export default class FetchApi<D extends keyof ApiRegistry> { ... }

   // After:
   export default class Via<D extends keyof ApiRegistry> { ... }
   ```

3. Update `src/index.ts`:
   ```typescript
   export { default as Via } from './Via.js';
   export type { default as Via } from './Via.js';
   ```

4. Search and replace imports:
   ```bash
   # Find all imports
   grep -r "from './FetchApi" src/
   grep -r "import.*FetchApi" __tests__/
   ```

5. Update test files to use `Via`:
   ```typescript
   import Via from '../src/Via.js';
   const api = new Via('https://...');
   ```

6. Run verification:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   pnpm build
   ```

## 📚 Context & References

- Package name is `@jeportie/via`
- README already uses `Via` in examples
- This aligns naming across package, class, and documentation

## 🔗 Dependencies

None - This can be done independently
