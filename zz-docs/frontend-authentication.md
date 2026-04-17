# Frontend authentication

## Scope

This document describes the current React frontend authentication flow, including login/register entry points, shared session state, background validation, protected routes, and request authentication.

## Auth entry routes

Frontend auth pages are routed in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L45):

- `/login`
- `/register`

Both routes are lazy-loaded as part of the shared route tree in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L6).

## Session model

The frontend now treats the authenticated server session as the source of truth and localStorage as a persistence cache.

Session state lives in [frontend/src/contexts/auth/AuthContext.tsx](frontend/src/contexts/auth/AuthContext.tsx#L1) and is exposed through `useAuth()`.

Session behavior:

1. Login/register write the normalized user and token through the shared auth store.
2. Startup reads cached session data from localStorage.
3. If a token exists, the app validates it against `GET /api/me` and refreshes the user payload.
4. Focus, visibility changes, and a conservative interval re-run session validation.
5. Any `401` from the shared fetch helper clears the session and allows protected routes to redirect to `/login`.

## Login flow

Implementation: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L1)

Current behavior:

1. Submits credentials to `${VITE_API_BASE_URL}/login` via JSON POST.
2. Parses the response text, then decodes JSON.
3. Normalizes the returned user and writes the session through `setSession()`.
4. Persists the canonical snapshot to localStorage through the auth store.
5. Redirects to `/dashboard` on success.

## Register flow

Implementation: [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L1)

Current behavior:

1. Submits the registration payload to `${VITE_API_BASE_URL}/register` via JSON POST.
2. Parses the response text, then decodes JSON.
3. Normalizes the returned user and writes the session through `setSession()`.
4. Persists the canonical snapshot to localStorage through the auth store.
5. Redirects to `/dashboard` on success.

## Guard behavior

Route protection is centralized through [frontend/src/components/auth/RequireAuth.tsx](frontend/src/components/auth/RequireAuth.tsx#L1).

Protected routes in the router include:

- `/dashboard`
- `/profile`
- `/validate`

If the shared auth state is not authenticated, `RequireAuth` redirects to `/login`.

## Token usage in API requests

Bearer token injection is handled by [frontend/src/lib/apiFetch.ts](frontend/src/lib/apiFetch.ts#L1).

Behavior:

1. Adds `Authorization: Bearer <token>` when a cached token exists.
2. Sets `Accept: application/json` by default.
3. Dispatches an auth-expired event on `401` so the shared auth state can clear itself.

Converted call sites now use the shared helper instead of reading localStorage directly.

## User refresh behavior

The shared session refresh flow keeps profile-driven UI current without a full reload.

- `GET /api/me` is used as the canonical validation and refresh endpoint.
- `UserSettings` and `Sidebar` now render from the shared auth user.
- Email verification changes can appear after the next refresh cycle instead of waiting for a fresh login.

## Remaining notes

- `cart` and `orderId` still use localStorage, but they are not treated as auth identity.
- There is no refresh-token flow; expired sessions are cleared and the user is redirected to login on protected navigation.
