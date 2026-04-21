# Frontend authentication

## Purpose

Document the current frontend auth/session lifecycle, including login/register flows, route guarding, token propagation, and auto-refresh behavior.

## Auth architecture

- Shared auth state: `AuthProvider` + `useAuth()`
- Storage cache: localStorage (`token`, `user`) via `authSession.ts`
- Backend source-of-truth: `GET /api/me` refresh
- Request token injection: `apiFetch()`
- Guard component: `RequireAuth`

## Key files

- [frontend/src/contexts/auth/AuthContext.tsx](frontend/src/contexts/auth/AuthContext.tsx)
- [frontend/src/contexts/auth/useAuth.ts](frontend/src/contexts/auth/useAuth.ts)
- [frontend/src/lib/authSession.ts](frontend/src/lib/authSession.ts)
- [frontend/src/lib/apiFetch.ts](frontend/src/lib/apiFetch.ts)
- [frontend/src/components/auth/RequireAuth.tsx](frontend/src/components/auth/RequireAuth.tsx)
- [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx)
- [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx)

## Real code examples

### Route guard behavior

```tsx
if (status !== "ready") {
  return null;
}

if (!isAuthenticated) {
  return <Navigate to="/login" replace state={{ from: location }} />;
}
```

### Shared token injection and 401 session-expired signal

```ts
if (includeAuth && !mergedHeaders.has("Authorization")) {
  const { token } = readStoredAuthSession();
  if (token) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }
}

if (response.status === 401) {
  dispatchAuthSessionExpired();
}
```

### Session bootstrap and refresh

```tsx
const response = await fetch(`${apiBaseUrl}/me`, {
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${currentToken}`,
  },
});
```

### Login/register session write

```tsx
const user = normalizeAuthUser(data?.data?.user);

if (!user || !data?.data?.token) {
  throw new Error("Login succeeded but the session payload was invalid.");
}

setSession({ user, token: data.data.token });
navigate("/dashboard");
```

## Runtime behavior

- If cached token exists, provider bootstraps and validates via `/me`.
- Session refresh runs on visibility/focus and periodic interval.
- Any `401` through `apiFetch` clears auth state.
- Guarded routes redirect to `/login` when auth is invalid.

## Related docs

- [zz-docs/frontend-routing-navigation.md](zz-docs/frontend-routing-navigation.md)
- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
