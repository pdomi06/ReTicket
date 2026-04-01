# Frontend authentication

## Scope

This document describes authentication behavior currently implemented in the React frontend, including login/register entry points, local session storage, guarded pages, and token propagation to API requests.

## Auth entry routes

Frontend auth pages are routed in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L48):

- `/login`
- `/register`

Both routes are lazy-loaded as part of the shared route tree in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L6).

## Login flow

Implementation: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L13)

Current behavior:

1. Submits credentials to `${VITE_API_BASE_URL}/login` via JSON POST in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L31).
2. Parses response body as text first, then attempts JSON parse in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L40).
3. On success, stores:
   - `user` in localStorage.
   - `token` in localStorage.
     in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L54).
4. Redirects to dashboard (`/dashboard`) in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L56).
5. On failure, displays error text from local state in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L59).

## Register flow

Implementation: [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L13)

Current behavior:

1. Submits payload to `${VITE_API_BASE_URL}/register` via JSON POST in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L39).
2. Uses same text-first then JSON parse strategy as login in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L53).
3. On success, stores `user` and `token` in localStorage in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L68).
4. Redirects to dashboard (`/dashboard`) in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L70).
5. On failure, renders form-level error messages via local state in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L73).

## Session representation in frontend

The frontend currently treats localStorage as the client-side auth/session source of truth.

Stored keys observed in source:

- `token` for API bearer usage.
- `user` for profile rendering and some guard checks.
- `cart` for ticket cart restore logic (session-adjacent but not auth identity).

Examples:

- Token set in login/register pages: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L55), [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L69).
- User set in login/register pages: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L54), [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L68).

## Guard behavior

Route protection is component-level, not centralized in route metadata/middleware.

### Dashboard guard

`Dashboard` checks only localStorage `token` and redirects to `/login` if missing in [frontend/src/pages/dashboard/Dashboard.tsx](frontend/src/pages/dashboard/Dashboard.tsx#L11).

### Profile guard

`Profile` checks parsed localStorage `user` and redirects to `/login` if missing in [frontend/src/pages/profile/Profile.tsx](frontend/src/pages/profile/Profile.tsx#L17).

Result:

- Guard criteria are inconsistent between pages (token-based vs user-object-based).

## Token usage in API requests

Bearer token injection is done manually per request or per feature context, not through a centralized HTTP client.

Examples:

- Event context event fetch includes optional bearer header in [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L10).
- Cart context restore/add/remove operations include bearer headers in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L25), [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L79), and [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L144).
- Several dashboard CRUD pages also fetch token from localStorage before protected calls (for example create venue/event flows).

## API base URL behavior

Auth endpoints use `VITE_API_BASE_URL` with a fallback default in login/register pages:

- [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L8)
- [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L8)

The base URL string is normalized by removing trailing slashes before endpoint concatenation.

## Missing or partial frontend auth features

### No logout flow found

A frontend logout handler/route was not found in current source.

No matches were found for logout/remove-token patterns, and there is no dedicated logout page or action in current route tree.

### No refresh-token/session-renewal flow found

No explicit token refresh lifecycle was found in frontend source.

### No centralized auth provider/state machine

Auth state is not managed through a dedicated auth context/provider; checks are page-level and localStorage-driven.

### No role-based route gating in router

The dashboard sidebar groups links by role labels visually, but route access is not conditionally enforced in router config based on role claims.

## Known risks

- Inconsistent guard conditions can produce edge cases where one page is accessible while another redirects.
- Manual bearer injection across many files increases drift risk.
- Lack of logout/refresh logic can leave stale token/user state handling undefined.
- localStorage-only session coupling has security and synchronization trade-offs (for example stale data across tabs).

## TBDs

- Backend token expiry/refresh expectations are not enforced in frontend logic and should be treated as TBD from frontend-only evidence.
- Planned role-aware frontend route authorization strategy is TBD.
- Planned logout UX/API contract integration is TBD.
