# Pile Coding Challenge

## Stack

- Vite for build system
- Npm workspaces for client-server monorepo
- Headless UI for rich-components e.g. Listbox and Dialog
- Playwright for integration and API tests
- Redux Toolkit for API query library
- Fastify for API server
- Eslint and Prettier

## Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start the API server.

   ```bash
   # Dev
   npm run dev --workspace=server
   # Or
   npm run build --workspace=server
   npm start --workspace=server
   ```

3. Start the React client.

   ```bash
   # Dev
   npm run dev --workspace=client
   # Or
   npm run build --workspace=client
   npm run preview --workspace=client
   ```

4. Open `http://localhost:8081` in your browser.

## Testing

1. Run integration tests.

   ```bash
   npm test
   ```

2. Run API tests.

   ```bash
   npm test --workspace=server
   ```

## Possible improvements

- Cleanup styles and break apart `App.tsx` into smaller components.
- Add more validations like IBAN/BIC formatting.
- Add accounts API pagination.
- Add tests for not happy paths.
