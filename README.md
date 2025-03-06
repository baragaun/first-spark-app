# First Spark App

<img src="https://firstspark.global/icon.svg" alt="First Spark" width="100" height="100">

This is the frontend for the [First Spark platform](https://firstspark.social).

## Setting Up

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

## Testing

This project includes both unit tests and end-to-end (e2e) tests.

### Unit Tests

Unit tests are written using Vitest Library. To run unit tests:

```shell
# Run tests in watch mode (for development)
pnpm run test
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
