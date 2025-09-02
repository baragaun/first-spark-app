# First Spark App

<img src="https://firstspark.global/icon.svg" alt="First Spark" width="100" height="100">

This is the frontend for the [First Spark platform](https://firstspark.social).

## Setting Up

### NATS Server
1. Create a config file (let’s say in your home directory):
```shell
nano ~/nats-server.conf
```
2. Paste this minimal config:
```
# Default NATS TCP listener (for CLI / backend)
port: 4222

# Enable JetStream (optional but useful)
jetstream {
  store_dir: "./jetstream"
}

# WebSocket support (for browser frontend like Svelte)
websocket {
  port: 8080
  no_tls: true
}
```
Save and exit (Ctrl+O, Enter, Ctrl+X in nano).

3. Start the server:
```shell
nats-server -c ~/nats-server.conf
```

4. Set URL here `src/lib/services/bg-node-client.ts` in nats configuration.

Use [nvm](https://github.com/nvm-sh/nvm) ([install](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
if needed) to switch to the Node version this project uses:

```shell
nvm use
```

If you haven't already installed [pnpm](https://pnpm.io/):

```shell
npm install -g pnpm
```

Install dependencies:

```shell
pnpm install
```

Copy the development env file:

```bash
cp dev-env.txt .env
```

Start the development server:

```shell
pnpm run dev
```

## Building

To create a production version of your app:

```shell
pnpm build
```

You can preview the production build with `pnpm run preview`.

## Storybook

### Run Storybook

```shell
pnpm run storybook
```

### Run Storybook tests

```shell
# Run tests in watch mode (for development)
pnpm run test:storybook

# Run tests without watch mode (for CI)
pnpm run test:storybook:ci
```

## Testing

This project includes unit tests, and end-to-end (e2e) tests

### Unit Tests

Unit tests are written using Vitest Library. To run unit tests:

```shell
# Run tests in watch mode (for development)
pnpm run test:unit

# Run tests without watch mode (for CI)
pnpm run test:unit:ci
```

### End-to-End Tests

E2E tests are written using Playwright. To run e2e tests:

```shell
# Run e2e tests with UI (for development)
pnpm run test:e2e
or
pnpm playwright test --headed

# Run e2e tests headless (for CI)
pnpm run test:e2e:ci
or
pnpm playwright test
```

### Run All Tests

To run both unit and e2e tests in sequence:

```shell
pnpm run test:all
```

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
