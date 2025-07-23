# usage-statistics Backend plugin

Welcome to `usage-statistics` backend plugin. This plugin provides data for the [usage-statistics](../usage-statistics/) frontend plugin.

## Setup

1. This plugin is installed via the `@codeverse-gp/plugin-usage-statistics-backend` package. To install it to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add @codeverse-gp/plugin-usage-statistics-backend
```

2. Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@codeverse-gp/plugin-usage-statistics-backend'));
```

3. Now run `yarn start-backend`from the repo root.
4. Finally open `http://localhost:7007/api/usage-statistics/health` in a browser and it should return **OK**.

## Links

- [Frontend part of the plugin](https://www.npmjs.com/package/@codeverse-gp/plugin-usage-statistics)
- [The Backstage homepage](https://backstage.io)
