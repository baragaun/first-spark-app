# FSData Client Initialization in SvelteKit

## Overview

We initialize the FSData client (BgNodeClient) in `src/routes/+layout.ts` to ensure proper client-side initialization across our SvelteKit application. This document explains why we chose this approach and how it works.

## Why +layout.ts?

1. **Global Initialization**

   - `+layout.ts` is executed for every route in the application
   - Ensures the FSData client is initialized before any page components are rendered
   - Provides consistent client state across all routes

2. **Browser-Only Execution**

   - FSData client requires browser-specific features (RxDB)
   - `+layout.ts` allows us to use SvelteKit's `browser` check
   - Prevents initialization attempts during Server-Side Rendering (SSR)

3. **Load Function Benefits**
   - Provides initialization status to all routes via the load function
   - Handles errors gracefully and makes them available to the UI
   - Integrates with SvelteKit's navigation and loading system

## Implementation Details

```typescript
import type { LayoutLoad } from './$types';
import init from '$lib/services/dataProvider/init';
import { browser } from '$app/environment';

export const load: LayoutLoad = async () => {
  if (browser) {
    try {
      await init();
      return {
        initialized: true,
        error: null,
      };
    } catch (err) {
      return {
        initialized: false,
        error: err instanceof Error ? err.message : 'Failed to initialize client',
      };
    }
  }

  return {
    initialized: false,
    error: null,
  };
};
```

## How It Works

1. **Environment Check**

   - Uses SvelteKit's `browser` helper to detect browser environment
   - Skips initialization during SSR
   - Returns default state for server-side rendering

2. **Initialization Flow**

   - Attempts to initialize FSData client only in browser
   - Stores client instance in `clientStore` for global access
   - Provides initialization status to all routes

3. **Error Handling**
   - Catches and processes initialization errors
   - Makes error information available to UI components
   - Allows for graceful degradation when initialization fails

## Alternative Approaches Considered

1. **+layout.server.ts**

   - Not suitable because FSData client requires browser environment
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

1. **Access FSData Client**

   ```typescript
   import clientStore from '$lib/services/dataProvider/clientStore';

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
- `src/lib/services/dataProvider/init.ts` - FSData client initialization
- `src/lib/services/dataProvider/clientStore.ts` - Global client storage
- `src/routes/+layout.svelte` - Layout component using initialization status

## References

- [SvelteKit Load Functions](https://kit.svelte.dev/docs/load)
- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [FSData Client Documentation](https://github.com/baragaun/bg-node-client/blob/main/README.md)
