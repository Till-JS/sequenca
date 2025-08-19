# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server (runs on http://localhost:5173)
- `pnpm build` - Build production version
- `pnpm preview` - Preview production build locally

### Code Quality
- `pnpm lint` - Run Prettier and ESLint checks
- `pnpm format` - Auto-format code with Prettier
- `pnpm check` - Run Svelte type checking
- `pnpm check:watch` - Watch mode for type checking

### Testing
- `pnpm test:unit` - Run Vitest unit tests
- `pnpm test:e2e` - Run Playwright e2e tests
- `pnpm test` - Run all tests (unit + e2e)

To run a single test file:
- Unit: `pnpm test:unit path/to/test.test.ts`
- E2E: `pnpm test:e2e path/to/test.spec.ts`

## Architecture

### Technology Stack
- **SvelteKit 2.22.0** with **Svelte 5** - Using latest Svelte syntax with `$props()` and `{@render}`
- **TypeScript** - All components and routes should be typed
- **TailwindCSS 4.0.0** - Utility-first CSS framework
- **Paraglide JS** - Internationalization framework with server-side support

### Project Structure
- `src/routes/` - File-based routing (SvelteKit convention)
  - `+page.svelte` - Page components
  - `+layout.svelte` - Layout wrappers
  - `+server.ts` - Server-side endpoints
- `src/lib/` - Reusable components and utilities
  - `src/lib/paraglide/` - Generated i18n runtime code
- `messages/` - Internationalization message files (en.json, de.json)
- `e2e/` - Playwright end-to-end tests

### Internationalization Architecture
The app uses Paraglide JS for i18n with:
- **Server-side locale detection** in `src/hooks.server.ts` - Handles Accept-Language headers and cookie persistence
- **Client-side routing** in `src/hooks.ts` - Manages localized URLs
- **Runtime message loading** - Messages are compiled to JavaScript modules
- **URL-based locale switching** - Routes automatically prefixed with locale (e.g., `/de/demo`)

To add new translations:
1. Edit message files in `messages/en.json` and `messages/de.json`
2. Run `pnpm build` to regenerate Paraglide runtime code
3. Import messages from `$lib/paraglide/messages` in components

### Testing Strategy
- **Unit tests** (Vitest) - Component logic and utility functions
  - Browser environment for Svelte components
  - Node environment for server-side code
- **E2E tests** (Playwright) - User flows and page interactions
  - Tests build the app before running
  - Located in `e2e/` directory

### Key Patterns
- All Svelte components use the new Svelte 5 syntax
- TypeScript is used throughout (`.svelte` files have `lang="ts"` in script tags)
- TailwindCSS classes for styling (configured in `tailwind.config.js`)
- Paraglide messages are type-safe and tree-shakeable