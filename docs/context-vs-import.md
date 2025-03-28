# Context API vs Direct Import

## Overview

This document explains why we use Svelte's Context API (`getContext`) for accessing the `myUserContext` instead of directly importing it from the module.

## Approach Comparison

### Direct Import (Not Recommended)
```typescript
import { myUserContext } from '@/contexts/my-user-context.svelte';
```

### Context API (Recommended)
```typescript
import { getContext } from 'svelte';
const myUserContext = getContext<MyUserContext>('myUserContext');
```

## Why Context API is Better

1. **Testing and Storybook Integration**
   - Using the Context API allows us to easily mock the context in Storybook and tests
   - We can provide different context implementations without modifying component code
   - Our `mock-user-provider.svelte` can inject a mock context that components consume

2. **Avoiding Singleton Issues**
   - Direct imports create tight coupling to a singleton implementation
   - Context API allows dependency injection, making components more flexible
   - Prevents shared state issues during testing

## Implementation Example

In components:
```typescript
import { getContext } from 'svelte';
import type { MyUserContext } from '@/contexts/my-user-context.svelte';

const myUserContext = getContext<MyUserContext>('myUserContext');
```

In Storybook:
```typescript
// In mock-user-provider.svelte
import { setContext } from 'svelte';
import { mockMyUserContext } from './mock-user-context';

setContext('myUserContext', mockMyUserContext);
```

## References

- [Svelte Context API Documentation](https://svelte.dev/docs/kit/state-management#Using-state-and-stores-with-context)
- See our mock implementation in `src/stories/mocks/mock-user-provider.svelte`