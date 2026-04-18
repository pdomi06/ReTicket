# Frontend state and API integration

## Purpose

Document how frontend state is managed and how API calls are integrated today, including context responsibilities, auth token handling, and endpoint coupling.

## Overview

State management is Context API + local component state, and API communication is direct `fetch` usage across contexts and pages.

- A shared auth context and shared fetch helper now exist for session-sensitive traffic.
- `VITE_API_BASE_URL` is the API base source used in contexts/pages.
- Auth token and user session data are persisted in localStorage as a cache, but the server-authenticated session is the source of truth.
- Event and cart state coordination is indirect and happens through Event-page callbacks.
- Checkout flow state is split between component state and localStorage (`orderId`) in cart flow.

## Key files and locations

- Auth context provider: [frontend/src/contexts/auth/AuthContext.tsx](frontend/src/contexts/auth/AuthContext.tsx#L1)
- Auth hook: [frontend/src/contexts/auth/useAuth.ts](frontend/src/contexts/auth/useAuth.ts#L1)
- Shared fetch helper: [frontend/src/lib/apiFetch.ts](frontend/src/lib/apiFetch.ts#L1)
- Event context provider: [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L1)
- Cart context provider: [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L1)
- Event-page data hook: [frontend/src/pages/event/useEventData.ts](frontend/src/pages/event/useEventData.ts#L43)
- Event seat bridge component: [frontend/src/pages/event/SeatSelector.tsx](frontend/src/pages/event/SeatSelector.tsx#L18)
- Checkout page API call chain: [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx)

## Patterns and conventions

### Environment and endpoint base

- API requests generally derive base URL from `import.meta.env.VITE_API_BASE_URL`.
- Login and register include a local fallback base URL if env is absent.

### Auth context responsibilities

#### AuthContext

- Owns `user`, `token`, `status`, `isAuthenticated`, `setSession`, `refreshSession`, and `clearSession`.
- Bootstraps from cached localStorage and validates against `GET /api/me`.
- Refreshes on app focus, tab visibility changes, and a low-frequency interval.
- Clears auth state when the shared fetch helper reports `401`.

#### EventContext

- Holds a single `event` object and `getEvent(id)` function.
- Uses the shared fetch helper so authorization is attached consistently.
- Guards against non-JSON/non-OK responses and clears state to `undefined` on failure.

#### CartContext

- Maintains `tickets` state and exposes `addToCart`, `removeFromCart`, `clearCart`.
- Restores cart from localStorage and attempts to re-reserve seats through `/ticketForSale/addToBasket/:id` on mount.
- Uses the shared fetch helper for basket, listing, and removal requests so auth expiry is handled consistently.
- Persists cart changes back to localStorage.

### API interaction style

- Calls are still implemented with inline `fetch` for most domain requests, but auth-bearing traffic now routes through a shared helper.
- Authorization headers are assembled centrally in the helper for session-aware requests.
- Error handling is local, often with `console.error` and page/context state messages.
- Some endpoints are guarded by content-type checks before parsing JSON.

### Auth/session handling pattern

- Login/register now write through the shared auth context and persist the canonical session snapshot.
- The shared auth context is the canonical in-memory source for authenticated user state.
- Token attachment is centralized through [frontend/src/lib/apiFetch.ts](frontend/src/lib/apiFetch.ts#L1).

## Gotchas and known issues

- API contract handling is inconsistent by endpoint, so each page/context contains custom parsing logic.
- The shared auth helper normalizes auth expiry, but non-auth requests still use endpoint-specific parsing.
- Cart restore attempts to reserve previously saved seats on load; stale entries may fail and be dropped.
- Event and cart synchronization depends on explicit page-level callback wiring, not cross-context state orchestration.
- Missing auth headers are less likely on converted pages, but ad hoc fetch calls can still drift if they bypass `apiFetch`.
- Cart payment flow persists `orderId` in localStorage and relies on query params after redirect, which increases coupling between browser state and backend flow completion.
