# First Spark App

A multi-brand digital gift card marketplace platform built with SvelteKit 5 and TypeScript.

## Project Overview

First Spark App allows users to discover, purchase, and manage digital gift cards from various brands. The application supports multiple projects (First Spark, KCU, Tapco) with distinct branding while sharing a unified codebase.

### Core Features

- **User Authentication**: Sign up, sign in, password reset, email verification
- **Digital Wallet**: Store, manage, and organize purchased gift cards
- **Marketplace**: Browse and purchase gift cards from multiple brands
- **Gift Card Upload**: Upload physical gift card details via OCR/AI extraction
- **Gift Card Transfers**: Send gift cards to other users with security features
- **Shopping Cart & Checkout**: Add items to cart before purchase
- **Order History**: Track purchases and transactions

## Tech Stack

- **Framework**: SvelteKit 2.16 with Svelte 5.0 (runes)
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 3.4
- **UI Components**: Bits UI, Lucide Svelte icons
- **Backend Client**: @baragaun/bg-node-client (GraphQL)
- **Database**: RxDB with IndexedDB
- **Forms**: Sveltekit Superforms + Zod validation
- **i18n**: Paraglide.js
- **Testing**: Vitest, Playwright, Storybook
- **AI**: GitHub Models (Grok 3 Mini) for OCR extraction

## Project Structure

```
src/
├── routes/                    # SvelteKit file-based routing
│   ├── api/                   # API endpoints (ai, pdf generation)
│   ├── signin/, signup/       # Authentication pages
│   ├── wallet/                # Gift card wallet management
│   ├── marketplace/           # Gift card marketplace
│   ├── cart/                  # Shopping cart
│   ├── order-history/         # Purchase history
│   └── settings/              # User account settings
│
├── lib/
│   ├── components/            # Reusable Svelte components
│   │   ├── ui/               # UI primitives (buttons, inputs, modals)
│   │   ├── forms/            # Form components
│   │   └── layout/           # Navbar, sidebar, footer
│   │
│   ├── contexts/              # State management
│   │   ├── my-user-context.svelte.ts      # User auth & profile
│   │   └── marketplace-context.svelte.ts  # Marketplace operations
│   │
│   ├── stores/                # Svelte stores (rune-based)
│   │   ├── app-store.svelte.ts           # App settings, branding
│   │   ├── marketplace-store.svelte.ts   # Marketplace data cache
│   │   └── wallet-store.svelte.ts        # Wallet items cache
│   │
│   ├── services/              # External service integrations
│   ├── utils/                 # Utility functions
│   ├── helpers/               # Helper functions
│   ├── schemas/               # Zod validation schemas
│   ├── types/                 # TypeScript types & enums
│   └── paraglide/             # Auto-generated i18n
```

## Development Commands

```bash
# Setup
pnpm install                   # Install dependencies
cp dev-env.txt .env            # Copy dev environment

# Development
pnpm run dev                   # Start dev server (localhost:5173)
pnpm run build                 # Build for production
pnpm run preview               # Preview production build

# Code Quality
pnpm run check                 # Svelte type checking
pnpm run lint                  # ESLint + auto-fix
pnpm run format                # Format all code

# Testing
pnpm run test:unit             # Vitest watch mode
pnpm run test:e2e              # Playwright with UI
pnpm run storybook             # Component development
```

## Key Patterns

### State Management

Class-based contexts with Svelte runes for encapsulation and type safety:

```typescript
// Context classes export singletons
export const myUserContext = new MyUserContext();
export const marketplaceContext = new MarketplaceContext();

// Rune-based reactivity
let isLoading = $state(false);
let items = $derived.by(() => filterItems(allItems));
```

### Error Handling

Consistent unauthorized error detection with automatic signout and redirect:

```typescript
await handleUnauthorizedError(response.error, {
  signOut: () => this.client.operations.myUser.signMeOut(),
});
```

### Multi-brand Support

Environment variable `PUBLIC_PROJECTNAME` controls branding:
- **FirstSpark**: Default branding
- **KCU**: Custom color scheme
- **Tapco**: Separate branding

## Environment Variables

```
PUBLIC_FSDATA_URL              # GraphQL endpoint
PUBLIC_PROJECTNAME             # Brand: FirstSpark|KCU|Tapco
PUBLIC_LOG_LEVEL               # debug|info|warn|error|silent
PUBLIC_APP_ENVIRONMENT         # development|production
GITHUB_PAT                     # GitHub Models API token (server-side)
```

## API Endpoints

- **POST /api/ai/extract-gift-card**: AI-powered gift card text extraction
- **POST /api/generate-pdf**: Generate printable PDF with barcode
- **GET /api/image-proxy**: Proxy external gift card images

## Testing Strategy

- **Unit Tests**: Vitest with @testing-library/svelte
- **E2E Tests**: Playwright for full user workflows
- **Component Tests**: Storybook for visual regression
