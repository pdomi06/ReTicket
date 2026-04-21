# Frontend architecture

## Purpose

Describe the frontend architecture as implemented today: app bootstrap, route composition, provider boundaries, and shared layout behavior.

## Stack

- React 19 + TypeScript
- Vite build pipeline
- React Router (route objects + lazy modules)
- Context API for auth/loading/event/cart state
- CSS Modules + global tokens + Bootstrap utilities

## Key files

- App bootstrap: [frontend/src/main.tsx](frontend/src/main.tsx)
- Route tree: [frontend/src/app/router.tsx](frontend/src/app/router.tsx)
- Route rendering root: [frontend/src/app/App.tsx](frontend/src/app/App.tsx)
- Layout shell: [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx)

## Real code examples

### Root provider stack

```tsx
createRoot(rootElement).render(
  <LoadingProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </LoadingProvider>,
);
```

### Lazy route object composition

```tsx
const About = lazy(() => import("../pages/about/About.tsx"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.tsx"));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/about", element: <About /> },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
    ],
  },
];
```

### MainLayout provider shell + global loader

```tsx
<EventContextProvider>
  <CartContextProvider>
    <Navbar />
    <main className={styles.main}>
      <Outlet />
    </main>
    {!hideFooter && <Footer />}
  </CartContextProvider>
</EventContextProvider>

<PageLoader isEnabled={shouldShowGlobalLoader} />
```

## Current route topology notes

- Public routes include `/`, `/welcome`, `/browse`, `/event`, `/about`, `/contact`, `/terms`, `/privacy`, `/vendor`, `/cart`, `/checkout`.
- Guarded routes include `/profile`, `/validate`, and `/dashboard/*` through `RequireAuth`.
- Dashboard uses nested child routes for CRUD, analytics, admin lists, and settings.

## Architectural notes

- Global loader is disabled on dashboard layout pages and replaced by dashboard-contained loader.
- Suspense fallback uses the same visual loader components as global loading overlays.
- Event and cart providers are scoped in layout rather than globally at `main.tsx`.

## Related docs

- [zz-docs/frontend-routing-navigation.md](zz-docs/frontend-routing-navigation.md)
- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/frontend-global-loader.md](zz-docs/frontend-global-loader.md)
