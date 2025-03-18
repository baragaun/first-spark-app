# Data Provider Initialization

## Overview

We use [bg-node-client](https://github.com/baragaun/bg-node-client) to integrate with the
GraphQL API of our First Spark backend.

The Data Provider is used in this Svelte app to make it available throughout the app.

This page discusses where and how the Data Provider is initialized in the Svelte app, and
why we chose to implement it in this way.

## Why Initialize In +layout.ts?

1. **Global Initialization**

   - `+layout.ts` is executed for every route in the application
   - Ensures the Data Provider is initialized before any page components are rendered
   - Provides consistent client state across all routes

2. **Browser-Only Execution**

   - Data Provider requires browser-specific features (RxDB)
   - `+layout.ts` allows us to use SvelteKit's `browser` check
   - Prevents initialization attempts during Server-Side Rendering (SSR)

3. **Load Function Benefits**
   - Provides initialization status to all routes via the load function
   - Handles errors gracefully and makes them available to the UI
   - Integrates with SvelteKit's navigation and loading system

## How It Works

1. **Environment Check**

   - Uses SvelteKit's `browser` helper to detect browser environment
   - Skips initialization during SSR
   - Returns default state for server-side rendering

2. **Initialization Flow**

   - Attempts to initialize Data Provider only in browser
   - Stores client instance in `clientStore` for global access
   - Provides initialization status to all routes

3. **Error Handling**
   - Catches and processes initialization errors
   - Makes error information available to UI components
   - Allows for graceful degradation when initialization fails

## Alternative Approaches Considered

1. **+layout.server.ts**

   - Not suitable because Data Provider requires browser environment
   - Would conflict with RxDB's browser-only requirements

2. **Individual Page Initialization**

   - Would lead to redundant initialization attempts
   - Could cause race conditions and inconsistent state
   - Wouldn't provide global client availability

3. **App-level Store**
   - Would require manual initialization timing
   - Wouldn't integrate as well with SvelteKit's routing
   - Could miss critical initialization errors

## Best Practices

1. **Access Data Provider**

   ```typescript
   import clientStore from '@/services/dataProvider/dataProvider';

   const client = clientStore.getClient();
   if (client) {
     // Use client
   }
   ```

2. **Check Initialization Status**

   ```typescript
   export const load = async ({ data }) => {
     if (!data.initialized) {
       // Handle uninitialized state
     }
   };
   ```

3. **Error Handling**

   ```svelte
   <script>
     export let data;
   </script>

   {#if data.error}
     <div class="error">
       Failed to initialize: {data.error}
     </div>
   {/if}
   ```

## Related Files

- `src/routes/+layout.ts` - Main initialization logic
- `src/lib/services/dataProvider/init.ts` - Data Provider initialization
- `src/lib/services/dataProvider/clientStore.ts` - Global client storage
- `src/routes/+layout.svelte` - Layout component using initialization status

## References

- [SvelteKit Load Functions](https://kit.svelte.dev/docs/load)
- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [bg-node-client](https://github.com/baragaun/bg-node-client)
