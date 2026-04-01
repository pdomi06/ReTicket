# Frontend error boundaries and runtime failure handling

## Scope

This document describes how runtime errors are currently handled in the frontend, with emphasis on React error boundaries, route fallbacks, async error patterns, and user-visible failure states.

## Error boundary status

There is currently no explicit React error boundary implementation in source.

Evidence:

- No class components implementing `componentDidCatch` or `getDerivedStateFromError` were found in frontend source.
- No usage of error-boundary libraries (for example `react-error-boundary`) was found in frontend source.
- Route configuration uses `useRoutes` without route-level `errorElement` definitions in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L12) and [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40).

Practical implication:

- Uncaught render errors can bubble to the top-level React runtime and are not handled by a custom boundary UI.

## Existing fallback mechanisms

### Suspense fallback for lazy routes

Lazy route modules are wrapped in `Suspense` with a generic loading fallback in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L11).

This handles loading latency, not runtime exceptions.

### 404 fallback route

Unknown paths resolve to `*` -> NotFound in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L79), rendering [frontend/src/pages/notfound/NotFound.tsx](frontend/src/pages/notfound/NotFound.tsx#L3).

This handles routing misses, not component crashes.

## Current async error handling pattern

Most failure handling is local to feature/page code and implemented with `try/catch`, state flags, and inline messages.

### Browse page

- Throws on non-OK/non-JSON response in [frontend/src/pages/browse/Browse.tsx](frontend/src/pages/browse/Browse.tsx#L22).
- Maps errors into local `error` state and renders text fallback in [frontend/src/pages/browse/Browse.tsx](frontend/src/pages/browse/Browse.tsx#L41).

### Event data hook

- Uses defensive fetch checks and logs failures via `console.error` without throwing to boundary in [frontend/src/pages/event/useEventData.ts](frontend/src/pages/event/useEventData.ts#L18).
- On bad responses, often returns empty arrays or leaves existing state defaults.

### Cart context

- Contains multiple `try/catch` blocks for restore/add/remove basket workflows in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L14).
- Recovers from some failures by rollback or storage cleanup rather than propagating exceptions.

### Auth pages

- Login and register parse response defensively and surface errors through page-local state in:
  - [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L31)
  - [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L39)

### Dashboard CRUD forms

- Create/edit flows wrap submit pipelines in `try/catch` and show alert/message banners:
  - [frontend/src/pages/dashboard/create-event/CreateEvent.tsx](frontend/src/pages/dashboard/create-event/CreateEvent.tsx#L57)
  - [frontend/src/pages/dashboard/edit-event/EditEvent.tsx](frontend/src/pages/dashboard/edit-event/EditEvent.tsx#L114)
  - [frontend/src/pages/dashboard/create-venue/CreateVenue.tsx](frontend/src/pages/dashboard/create-venue/CreateVenue.tsx#L73)
  - [frontend/src/pages/dashboard/edit-venue/EditVenue.tsx](frontend/src/pages/dashboard/edit-venue/EditVenue.tsx#L91)

## User-visible error UX today

Current user-visible behavior is inconsistent across pages:

- Inline paragraph/alert-style messages in some pages (`Browse`, cart checkout, dashboard forms).
- Error arrays in login/register.
- Browser `alert(...)` still used in select flows (for example in create-venue).
- Silent console logging in several fetch utilities/hooks where no direct user feedback appears.

## Known risks

- No global guardrail for unexpected render exceptions.
- No shared fallback component for catastrophic failures.
- Inconsistent error presentation patterns can produce uneven UX.
- Some failures are only logged, so users may see stale/empty states without actionable guidance.

## Suggested direction (non-implemented)

The following are not yet implemented in source and are listed as improvement options:

- Add a top-level React error boundary around routed content.
- Add route-level `errorElement` strategy if migrating to data-router APIs.
- Standardize async error-to-UI mapping (for example a shared `ApiErrorNotice` pattern).
- Define a minimum policy for when failures must be shown to users versus logged silently.

## TBDs

- Production error telemetry pipeline beyond console logging is not evident in source (TBD).
- There is no explicit incident-grade crash recovery UX specification in docs/code (TBD).
