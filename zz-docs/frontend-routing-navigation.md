# Frontend routing and navigation

## Purpose

Describe route definitions, navigation entry points, and guard behavior in the current frontend app.

## Router model

- `BrowserRouter` is mounted in [frontend/src/main.tsx](frontend/src/main.tsx)
- Route rendering uses `useRoutes(routes)` in [frontend/src/app/App.tsx](frontend/src/app/App.tsx)
- Route objects are defined in [frontend/src/app/router.tsx](frontend/src/app/router.tsx)

## Real code examples

### Public and guarded routes

```tsx
{ path: "/about", element: <About /> },
{ path: "/contact", element: <Contact /> },
{ path: "/terms", element: <Terms /> },
{ path: "/privacy", element: <Privacy /> },
{ path: "/profile", element: <RequireAuth><Profile /></RequireAuth> },
```

### Guarded dashboard tree

```tsx
{
  path: "/dashboard",
  element: <RequireAuth><Dashboard /></RequireAuth>,
  children: [
    { index: true, element: <DashboardMyTickets /> },
    { path: "orders", element: <DashboardOrders /> },
    { path: "user-settings", element: <DashboardUserSettings /> },
  ],
},
```

### Fallback route

```tsx
{ path: "*", element: <NotFound /> },
```

## Navigation entry points

- Navbar links: `/`, `/cart`, `/about`, `/vendor`
- Footer links: `/privacy`, `/about`, `/contact`, `/terms`
- Dashboard sidebar links: nested `/dashboard/*` destinations
- Programmatic navigation is used in login/register/search/checkout flows.

## Parameter/query-driven routes

- `/dashboard/edit-venue/:id`
- `/dashboard/edit-event/:id`
- `/event?event=<id>`
- `/checkout?state=...&session_id=...`

## Notes

- Static informational routes (`/about`, `/contact`, `/terms`, `/privacy`) are now declared and active.
- Guarding is centralized through `RequireAuth`, not per-page localStorage checks.
- Unknown routes fall through to `NotFound`.

## Related docs

- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
- [zz-docs/frontend-authentication.md](zz-docs/frontend-authentication.md)
- [zz-docs/frontend-user-flows.md](zz-docs/frontend-user-flows.md)
