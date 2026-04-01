# Frontend state and API integration

## Purpose

Document how frontend state is managed and how API calls are integrated today, including context responsibilities, auth token handling, and endpoint coupling.

## Overview

State management is Context API + local component state, and API communication is direct `fetch` usage across contexts and pages.

- No centralized API client abstraction was found.
- `VITE_API_BASE_URL` is the API base source used in contexts/pages.
- Auth token and user session data are stored in localStorage and attached manually where needed.
- Event and cart state coordination is indirect and happens through Event-page callbacks.

## Key files and locations

- Event context provider: [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L5)
- Event context definition: [frontend/src/contexts/event/EventContextDef.tsx](frontend/src/contexts/event/EventContextDef.tsx#L5)
- Cart context provider: [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L5)
- Cart context definition: [frontend/src/contexts/cart/CartContextDef.tsx](frontend/src/contexts/cart/CartContextDef.tsx#L5)
- Event-page data hook: [frontend/src/pages/event/useEventData.ts](frontend/src/pages/event/useEventData.ts#L43)
- Event seat bridge component: [frontend/src/pages/event/SeatSelector.tsx](frontend/src/pages/event/SeatSelector.tsx#L18)
- Checkout page API call: [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L71)
- Login/register token writes: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L54), [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L68)

## Patterns and conventions

### Environment and endpoint base

- API requests generally derive base URL from `import.meta.env.VITE_API_BASE_URL` (for example [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L7)).
- Login and register include a local fallback base URL if env is absent in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L8) and [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L8).

### Context responsibilities

#### EventContext

- Holds a single `event` object and `getEvent(id)` function in [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L6).
- Adds Authorization header only when token exists in localStorage in [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L10).
- Guards against non-JSON/non-OK responses and clears state to `undefined` on failure in [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L20).

#### CartContext

- Maintains `tickets` state and exposes `addToCart`, `removeFromCart`, `clearCart` in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L5).
- Restores cart from localStorage and attempts to re-reserve seats through `/ticketForSale/addToBasket/:id` on mount in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L10).
- Persists cart changes back to localStorage in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L67).

### API interaction style

- Calls are implemented with inline `fetch` per context/page; no shared interceptor/hook/client module.
- Authorization headers are manually assembled each call site where required.
- Error handling is local, often with `console.error` and page/context state messages.

### Event-to-cart coupling behavior

- Contexts do not directly sync with each other.
- `SeatSelector` bridges them by using `CartContext` actions and then forcing ticket refresh via `onReload` callback from `useEventData` in [frontend/src/pages/event/SeatSelector.tsx](frontend/src/pages/event/SeatSelector.tsx#L75).
- `useEventData` deduplicates concurrent `/originalTickets/forSale/:eventId` requests via an in-memory `Map` in [frontend/src/pages/event/useEventData.ts](frontend/src/pages/event/useEventData.ts#L6).

### Auth/session handling pattern

- Login/register store `user` and `token` in localStorage:
  - [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L54)
  - [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L68)
- There is no dedicated AuthContext in current code.
- Token attachment is optional and repeated across many modules.

## Examples (real code)

### Example 1: Cart add flow API chain

`addToCart` performs:

1. `/originalTickets/search?eventId=&row=&seatNumber=`
2. `/ticketForSale/search?originalTicketId=`
3. `/ticketForSale/addToBasket/:id`

Reference: [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L76)

### Example 2: Checkout call without bearer token

- Cart checkout posts to `/ticketForSale/checkOut` with email + ticket IDs and no Authorization header in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L71).

### Example 3: Event ticket refresh bridge

- Seat toggle action executes cart mutation then triggers `onReload()` to sync seat availability in [frontend/src/pages/event/SeatSelector.tsx](frontend/src/pages/event/SeatSelector.tsx#L83).

### Example 4: Event fetch envelope fallback

- Event context reads either `json.data` or raw `json` to handle mixed backend envelope responses in [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L29).

## Gotchas and known issues

- API contract handling is inconsistent by endpoint, so each page/context contains custom parsing logic.
- Lack of shared API client means repeated header/error logic and drift risk.
- Cart restore attempts to reserve previously saved seats on load; stale entries may fail and be dropped.
- Event and cart synchronization depends on explicit page-level callback wiring, not cross-context state orchestration.
- No centralized auth state layer exists; missing Authorization header on protected endpoint calls is easy to introduce.

## Related docs

- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
- [zz-docs/frontend-user-flows.md](zz-docs/frontend-user-flows.md)
- [zz-docs/frontend-authentication.md](zz-docs/frontend-authentication.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
