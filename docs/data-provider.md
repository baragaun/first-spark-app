# Data Provider

## Overview

We use [bg-node-client](https://github.com/baragaun/bg-node-client) to integrate with the 
GraphQL API of our First Spark backend.

The Data Provider is used in this Svelte app to make it available throughout the app.
It is initialized in `src/routes/+layout.ts`. 

## Initialization

The Data Provider is initialized in `src/routes/+layout.ts`. See
the [tech decision discussion](./tech-decisions/data-provider-initialization.md) on why 
we implemented it this way.

## Access Data Provider

todo
