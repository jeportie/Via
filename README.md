# Via

> Type-safe fetch wrapper for TypeScript

[![npm version](https://img.shields.io/npm/v/@jeportie/via.svg)](https://www.npmjs.com/package/@jeportie/via) [![CI](https://github.com/jeportie/via/workflows/CI/badge.svg)](https://github.com/jeportie/via/actions) [![codecov](https://codecov.io/gh/jeportie/via/branch/main/graph/badge.svg)](https://codecov.io/gh/jeportie/via) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

Via is a fetch wrapper that generates TypeScript types from your OpenAPI schemas. You get autocomplete for routes, type-checked payloads, and errors caught at compile time instead of runtime.

```typescript
import { Via } from '@jeportie/via';

const api = new Via('https://petstore3.swagger.io');

// TypeScript knows your entire API
const pet = await api.get('/pet/123');
//    ^? Pet type from your OpenAPI schema

await api.post('/pet', {
  name: 'Rex',
  photoUrls: [],
});
```

## Why?

Writing API clients by hand sucks. You're constantly checking docs, fixing typos, and debugging payloads that don't match the backend schema.

Via fixes this by generating TypeScript types from your OpenAPI spec. Your editor now knows your entire API - every endpoint, every field, every status code.

**What you get:**

- Autocomplete for all endpoints and methods
- Type-checked request bodies
- Typed responses
- Compile-time errors for invalid requests
- No boilerplate code

## Quick Start

```bash
npm install @jeportie/via
```

Generate types from your API:

```bash
npx via
```

The CLI asks for your OpenAPI URL and base URL, then generates types:

```
src/
├── schema/
│   └── myApiSchema.ts      # Generated types
└── apiRegistry.ts          # URL → schema mapping
```

Use it:

```typescript
import { Via } from '@jeportie/via';

const api = new Via('https://api.example.com');

// TypeScript knows everything
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'Alice' });
```

Done.

## Features

### What Via Does Now (v1.0)

✅ **Type-safe REST client** — GET, POST, PUT, DELETE with full type inference ✅ **OpenAPI integration** — Generate types from OpenAPI 3.x specs ✅ **Interactive CLI** — Guided setup for schema generation ✅ **Grouped method style** — Use `api.get.users.findById(123)` or `api.get('/users/123')` ✅ **Untyped fallback** — Works as regular fetch wrapper for non-registered APIs ✅ **Dual module support** — CommonJS and ESM ✅ **Zero config** — Works out of the box

### What's Coming Next

#### Query Parameters (v1.1)

Type-safe URL query strings.

**Why?** Right now you have to build query strings manually:

```typescript
// Current workaround
await api.get('/users?role=admin&status=active');

// Future
await api.get('/users', {
  query: { role: 'admin', status: 'active' },
});
// TypeScript knows valid query params from schema
```

**Use case:** Filtering, pagination, sorting - anything that uses URL params.

---

#### Path Parameters (v1.1)

Auto-substitute `{id}` style params.

**Why?** Stop doing string interpolation:

```typescript
// Current
await api.get(`/users/${userId}/posts/${postId}`);

// Future
await api.get('/users/{userId}/posts/{postId}', {
  params: { userId: 123, postId: 456 },
});
// TypeScript enforces correct param names and types
```

**Use case:** REST APIs with nested resources, dynamic routes.

---

#### Typed Error Responses (v1.1)

Different types for different status codes.

**Why?** Right now all errors are generic. Future:

```typescript
try {
  await api.post('/users', data);
} catch (error) {
  if (error.status === 400) {
    // error.body is ValidationError type
    console.log(error.body.fields);
  }
  if (error.status === 401) {
    // error.body is UnauthorizedError type
    redirectToLogin();
  }
}
```

**Use case:** Different handling for validation errors vs auth errors vs server errors.

---

#### Authentication Helpers (v1.1)

Built-in support for common auth patterns.

**Why?** Stop repeating yourself:

```typescript
// Current
const api = new Via('https://api.example.com', {
  headers: { Authorization: `Bearer ${token}` },
});

// Future
const api = new Via('https://api.example.com', {
  auth: { bearer: token },
  // or: { apiKey: key }
  // or: { basic: { user, pass } }
});

// Auto-refreshing tokens
api.setAuth({
  bearer: token,
  onUnauthorized: async () => {
    const newToken = await refreshToken();
    return { bearer: newToken };
  },
});
```

**Use case:** Every app with auth. Makes token refresh automatic.

---

#### Request Interceptors (v1.1)

Middleware for logging, headers, retry logic.

**Why?** Add cross-cutting concerns without repeating code:

```typescript
const api = new Via('https://api.example.com');

// Log all requests
api.use(async (req, next) => {
  console.log(`${req.method} ${req.url}`);
  const start = Date.now();
  const res = await next(req);
  console.log(`${res.status} (${Date.now() - start}ms)`);
  return res;
});

// Add headers
api.use(async (req, next) => {
  req.headers.set('X-Request-ID', generateId());
  return next(req);
});

// Retry on failure
api.use(async (req, next) => {
  for (let i = 0; i < 3; i++) {
    try {
      return await next(req);
    } catch (err) {
      if (i === 2) throw err;
      await sleep(1000 * Math.pow(2, i));
    }
  }
});
```

**Use case:** Logging, monitoring, request IDs, automatic retries, custom headers.

---

#### Watch Mode (v1.2)

Auto-regenerate types when schema changes.

**Why?** Backend changes break your frontend. Know immediately:

```bash
npx via watch https://api.example.com/openapi.json
```

Watches schema URL, regenerates types on change. Pairs with your dev server's hot reload.

**Use case:** Active development where backend and frontend change together.

---

#### Multi-Status Types (v1.2)

Different response types per status code.

**Why?** APIs return different shapes for 200 vs 201 vs 206:

```typescript
const result = await api.post('/users', data);

if (result.status === 201) {
  result.body; // User type
  console.log('Created:', result.body.id);
}
if (result.status === 200) {
  result.body; // ExistingUser type
  console.log('Already exists');
}
```

**Use case:** APIs that return partial content (206), created vs updated (201 vs 200), accepted for processing (202).

---

#### React Hooks (v1.3)

Easy data fetching in React.

**Why?** Reduce boilerplate for loading states and caching:

```typescript
function UserList() {
  const { data, loading, error } = useApiQuery(api =>
    api.get('/users')
  );

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;
  return <List users={data} />;
}

function CreateUser() {
  const [create, { loading }] = useApiMutation(api =>
    api.post('/users')
  );

  return (
    <button onClick={() => create({ name: 'Alice' })} disabled={loading}>
      Create User
    </button>
  );
}
```

**Use case:** React apps that talk to REST APIs. Handles caching, revalidation, race conditions.

---

#### Plugin System (v2.0)

Custom transformers and middleware.

**Why?** Every app has custom needs:

```typescript
import { Via, Plugin } from '@jeportie/via';

// Transform snake_case API to camelCase
const camelCasePlugin: Plugin = {
  afterResponse: (response) => {
    response.body = snakeToCamel(response.body);
    return response;
  },
};

// Add custom metrics
const metricsPlugin: Plugin = {
  beforeRequest: (req) => {
    metrics.increment('api.requests', { endpoint: req.url });
  },
  afterResponse: (res) => {
    metrics.timing('api.latency', res.duration);
  },
};

const api = new Via('https://api.example.com', {
  plugins: [camelCasePlugin, metricsPlugin],
});
```

**Use case:** Custom serialization, metrics, logging, error tracking, response normalization.

---

#### Mock Server (v2.0)

Generate mock API from OpenAPI schema.

**Why?** Test without backend:

```bash
npx via mock https://api.example.com/openapi.json --port 3000
```

Spins up mock server with realistic responses from your schema. Tests work even when backend is down.

**Use case:** Frontend development before backend is ready, reliable tests, demo environments.

## Usage

### Basic Usage

```typescript
import { Via } from '@jeportie/via';

const api = new Via('https://api.example.com');

// GET
const users = await api.get('/users');

// POST
const newUser = await api.post('/users', {
  name: 'Alice',
  email: 'alice@example.com',
});

// PUT
const updated = await api.put('/users/123', {
  name: 'Alice Smith',
});

// DELETE
await api.delete('/users/123');
```

### Grouped Method Style (SDK)

```typescript
import { Via } from '@jeportie/via';

const api = new Via('https://api.example.com');

// Fluent style
const user = await api.get.users.findById(123);
const posts = await api.get.users.posts.list({ userId: 123 });

// Create new resources
const newPost = await api.post.users.posts.create({
  userId: 123,
  title: 'Hello',
  body: 'World',
});
```

The SDK style organizes endpoints by resource. TypeScript infers everything from your OpenAPI schema.

### Untyped Mode

For APIs without OpenAPI schemas:

```typescript
import { Via } from '@jeportie/via';

// Use any URL, even unregistered ones
const api = new Via('https://some-api.com');

// Works as regular fetch wrapper
const data = await api.get('/endpoint');
```

You lose type safety but gain a nicer API than raw fetch.

## CLI

### Interactive Mode

```bash
npx via
```

Walks you through:

1. OpenAPI URL (where to fetch schema)
2. Base URL (runtime API URL)
3. Schema name (identifier for types)

Generates `src/schema/<name>.ts` and updates `src/apiRegistry.ts`.

### Manual Schema Management

If you want control:

```bash
# Generate types yourself
npx openapi-typescript https://api.example.com/openapi.json -o src/schema/mySchema.ts

# Update apiRegistry.ts manually
```

Then edit `src/apiRegistry.ts`:

```typescript
import type { paths as mySchema } from './schema/mySchema.js';

export interface ApiRegistry {
  'https://api.example.com': mySchema;
}
```

## How It Works

Via uses TypeScript's type system to extract types from OpenAPI schemas.

1. **Schema Generation**: CLI fetches OpenAPI spec, generates TypeScript types
2. **Registry Mapping**: Map base URLs to schemas at compile time
3. **Type Inference**: Via client extracts request/response types automatically
4. **Runtime Safety**: Invalid requests fail at compile time, not runtime

The type system walks your OpenAPI schema and figures out:

- Which endpoints exist
- Which HTTP methods they support
- What request body they expect
- What response they return

All automatically. No manual typing.

## Comparison

| Feature             | Via         | openapi-fetch | axios     | fetch     |
| ------------------- | ----------- | ------------- | --------- | --------- |
| Type Safety         | ✅ Full     | ✅ Full       | ❌ Manual | ❌ Manual |
| OpenAPI Integration | ✅ CLI      | ⚠️ DIY        | ❌ None   | ❌ None   |
| SDK Generation      | ✅ Yes      | ❌ No         | ❌ No     | ❌ No     |
| Untyped Fallback    | ✅ Yes      | ❌ No         | ✅ Yes    | ✅ Yes    |
| Bundle Size         | 🟢 Tiny     | 🟢 Tiny       | 🔴 Large  | 🟢 None   |
| Setup Required      | 🟢 CLI only | 🟡 Some       | 🔴 Lots   | 🟢 None   |

**Use Via if:** You have OpenAPI schemas and want type safety + good DX

**Use openapi-fetch if:** You want more control over schema generation

**Use axios if:** You need ancient browser support or complex interceptors

**Use fetch if:** You don't have schemas or want zero dependencies

## Contributing

Contributions welcome! This is an open-source project and help is appreciated.

**Quick setup:**

```bash
git clone https://github.com/jeportie/via.git
cd via
pnpm install
pnpm dev  # runs tests in watch mode
```

**Project structure:**

```
via/
├── src/
│   ├── FetchApi.ts          # Main client
│   ├── types.ts             # Type utilities
│   ├── apiRegistry.ts       # URL → schema mapping
│   └── cli/                 # CLI commands
├── __tests__/               # Tests
└── dist/                    # Built output
```

**Commands:**

```bash
pnpm dev              # Watch mode tests
pnpm test             # Run all tests
pnpm build            # Build CJS + ESM
pnpm check            # Format, lint, typecheck, test
pnpm format           # Prettier
pnpm lint             # ESLint
pnpm typecheck        # TypeScript
```

**Commit format:**

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add query parameter support
fix: correct path substitution
docs: update examples
```

**Pull requests:**

1. Fork the repo
2. Create a branch (`git checkout -b feat/my-feature`)
3. Commit changes (`git commit -m 'feat: add my feature'`)
4. Push (`git push origin feat/my-feature`)
5. Open a PR

See [DEV.md](DEV.md) for detailed development docs.

## License

MIT — see [LICENSE](LICENSE)

## Links

- **npm**: [@jeportie/via](https://www.npmjs.com/package/@jeportie/via)
- **GitHub**: [jeportie/via](https://github.com/jeportie/via)
- **Issues**: [github.com/jeportie/via/issues](https://github.com/jeportie/via/issues)
- **Author**: Jérôme Portier (jeromep.dev@gmail.com)

---

Made with ❤️ by [@jeportie](https://github.com/jeportie)
