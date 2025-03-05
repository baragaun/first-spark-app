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

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
