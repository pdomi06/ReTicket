# Frontend global loader

## Purpose

Document the global page-loading system: context API contract, rendering pipeline, loader UI composition, and migration rules for route/page implementations.

## Overview

The frontend now has a centralized page-level loading mechanism so route pages can signal asynchronous mount work without each page owning separate full-screen loader state.

- Loading state is tracked in a dedicated context with a ref-based active request counter.
- A single overlay renderer lives in the shared layout.
- Pages call a shared hook (`usePageLoading`) and pass a Promise or Promise array.
- The visual loading screen is centralized and themed via existing CSS variables.

## Key files and locations

- Loading context: [frontend/src/contexts/loading/LoadingContext.tsx](frontend/src/contexts/loading/LoadingContext.tsx#L1)
- Overlay host: [frontend/src/components/loading/PageLoader.tsx](frontend/src/components/loading/PageLoader.tsx#L1)
- Overlay styles: [frontend/src/components/loading/PageLoader.module.css](frontend/src/components/loading/PageLoader.module.css#L1)
- Loader content component: [frontend/src/components/loading/LoadingScreen.tsx](frontend/src/components/loading/LoadingScreen.tsx#L1)
- Loader content styles: [frontend/src/components/loading/LoadingScreen.module.css](frontend/src/components/loading/LoadingScreen.module.css#L1)
- Layout wiring: [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L1)

## API contract

### `usePageLoading()`

Returns the tracking function:

- Signature: `(promiseOrPromises: Promise<T> | Promise<T>[]) => Promise<T | T[]>`
- Behavior:

1. Increments active request counter before awaiting.
2. Awaits the provided promise(s) (`Promise.all` for array inputs).
3. Decrements counter in `finally` so rejected promises cannot leave the loader stuck.

### `useIsPageLoading()`

Returns a boolean that reflects whether at least one tracked request is active.

## Internal behavior details

The context uses a ref counter (`activeRequestCountRef`) instead of simple boolean toggling:

1. `incrementLoading()` sets `isPageLoading=true` only when counter transitions from 0 -> 1.
2. `decrementLoading()` clamps at 0 and sets `isPageLoading=false` only when counter reaches 0.

This prevents race conditions with overlapping asynchronous calls.

## Render pipeline

1. `MainLayout` mounts `LoadingProvider`.
2. `MainLayoutContent` reads `isPageLoading` via `useIsPageLoading()`.
3. The page content container gets a blocking class while loading (`pageLoading` -> `pointer-events: none`).
4. `PageLoader` renders once at layout level and shows/hides a fixed full-screen overlay.

## Visual system

The loading screen is intentionally minimal and theme-safe:

- Full-screen overlay (`position: fixed; inset: 0; z-index: 9999`).
- Background uses `var(--color-main)` to fully mask underlying content.
- Spinner/ring and text use existing theme tokens only.
- Rotating helper messages are cross-faded for softer transitions.

No external animation libraries are used.

## Current integration points

Tracked page-load flows currently include:

- Browse page initial search load.
- Welcome page landing fetch for `/`.
- Validate page initial event fetch.
- Dashboard events list initial fetch.
- Create Event mount venue fetch.
- Edit Event mount fetches (event + venues).
- Edit Venue mount fetch chain (venue + affected events).
- Event detail composite fetch flow in `useEventData`.

## Flicker prevention

To avoid first-frame content flash before overlay activation, tracked mount flows use `useLayoutEffect` when invoking `trackPageLoading(...)`.

This ensures loader activation happens before paint for those routes.

## Migration guidance for new pages

When a page performs mount-time async loading that should block the full page:

1. Import `usePageLoading`.
2. Build a Promise representing the mount load (or `Promise.all([...])` for concurrent loads).
3. Call `trackPageLoading(mountPromise)`.
4. Keep interaction-level loading local (button submits, row actions, incremental pagination).

Do not use the global loader for micro/interactions that should not freeze the entire page.

## Gotchas and guardrails

- Always decrement through `finally` (already guaranteed by `trackPageLoading`).
- Do not replace the app-level Suspense fallback; it handles lazy import loading before component mount.
- Avoid duplicated full-page `isLoading` booleans in pages that already use global tracking.
- Keep loader colors/styles bound to global CSS variables to preserve theme behavior.

## Related docs

- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/frontend-styling-system.md](zz-docs/frontend-styling-system.md)
