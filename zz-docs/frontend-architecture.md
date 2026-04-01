# Frontend architecture

## Purpose

Describe the frontend application architecture as implemented in source code: runtime stack, entry/routing composition, layout/provider boundaries, and current architectural constraints.

## Overview

The frontend is a React 19 + TypeScript SPA built with Vite, using React Router route objects and lazy-loaded pages.

- Runtime/build stack comes from [frontend/package.json](frontend/package.json#L1).
- Router composition is defined in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L1).
- Route rendering uses `useRoutes` inside Suspense in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L7).
- App shell and shared providers are centralized in [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L1).

## Key files and locations

- Dependencies and scripts: [frontend/package.json](frontend/package.json#L1)
- App bootstrap: [frontend/src/main.tsx](frontend/src/main.tsx#L1)
- Route rendering root: [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L1)
- Route object tree: [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L1)
- Main layout and shared providers: [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L1)
- Global style layer: [frontend/src/styles/global.css](frontend/src/styles/global.css#L1)

## Patterns and conventions

### Stack and tooling

- React 19 (`react`, `react-dom`) in [frontend/package.json](frontend/package.json#L22).
- TypeScript build via `tsc -b && vite build` in [frontend/package.json](frontend/package.json#L7).
- React Router v7 packages are installed (`react-router`, `react-router-dom`) in [frontend/package.json](frontend/package.json#L24).
- Vite React plugin configured in [frontend/vite.config.ts](frontend/vite.config.ts#L1).

### App entry and route rendering

1. `main.tsx` mounts `BrowserRouter` around `App` in [frontend/src/main.tsx](frontend/src/main.tsx#L7).
2. `App.tsx` renders `useRoutes(routes)` inside `Suspense` fallback in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L12).
3. `router.tsx` lazy-loads page modules and defines nested route objects in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L6).

### Layout and provider boundaries

- All routes render inside `MainLayout` root route in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L37).
- `MainLayout` wraps children with `EventContextProvider` and `CartContextProvider` in [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L14).
- Footer is hidden on dashboard routes using `pathname.startsWith('/dashboard')` in [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L10).

### Route topology (current)

- Public/common routes include `/`, `/welcome`, `/test`, `/login`, `/register`, `/profile`, `/browse`, `/event`, `/vendor`, `/cart` in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40).
- Dashboard is nested under `/dashboard` with many children (overview, CRUD pages, analytics/admin placeholders) in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L52).
- Catch-all `*` route maps to NotFound in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L84).

### State and API architecture

- Shared state uses Context API providers (event + cart), no centralized global store package found.
- API calls use native `fetch` directly in contexts/pages (for example [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L83)).
- Auth token is read from localStorage and attached manually in request headers (for example [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L10)).

### Styling architecture

- Global CSS imports Bootstrap stylesheet in [frontend/src/styles/global.css](frontend/src/styles/global.css#L1).
- A global wildcard selector applies font and color to all elements in [frontend/src/styles/global.css](frontend/src/styles/global.css#L15).
- Component-level styles are mainly CSS Modules (`*.module.css`).
- Tailwind dependencies are installed, but no Tailwind directives/usage were found under `frontend/src/**` during this doc pass.

## Examples (real code)

### Example 1: Route tree with lazy modules

- Route modules are lazily imported in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L6).
- Nested dashboard route children are defined in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L55).

### Example 2: Mixed route-protection pattern

- Dashboard redirects to `/login` when no token in [frontend/src/pages/dashboard/Dashboard.tsx](frontend/src/pages/dashboard/Dashboard.tsx#L10).
- Profile redirects to `/login` based on `user` localStorage object in [frontend/src/pages/profile/Profile.tsx](frontend/src/pages/profile/Profile.tsx#L15).

### Example 3: Broken nav route reference

- Navbar links to `/about` in [frontend/src/components/layout/navbar/navbar.tsx](frontend/src/components/layout/navbar/navbar.tsx#L16).
- No `/about` route exists in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40), so it falls to NotFound.

## Gotchas and known issues

- Route guarding is decentralized and inconsistent across pages (token check vs user-object check).
- `MainLayout` wraps contexts globally, but contexts do not directly coordinate business logic; page-level bridging is used elsewhere.
- Bootstrap carousel markup is present in [frontend/src/pages/welcome/carouser/Carouser.tsx](frontend/src/pages/welcome/carouser/Carouser.tsx#L8), but Bootstrap JS bundle import was not found in `src`.
- Placeholder/in-progress route surfaces exist:
  - `/test` page in [frontend/src/pages/test/test.tsx](frontend/src/pages/test/test.tsx#L2)
  - welcome mock cards/TODO note in [frontend/src/pages/welcome/Welcome.tsx](frontend/src/pages/welcome/Welcome.tsx#L16)
  - dashboard website management stub in [frontend/src/pages/dashboard/website/WebsiteManagement.tsx](frontend/src/pages/dashboard/website/WebsiteManagement.tsx#L1)
- Additional installed dependencies (for example `@auth0/auth0-react`, `next-themes`) are present in [frontend/package.json](frontend/package.json#L12) but corresponding architecture usage was not verified in app source (TBD).

## Related docs

- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/frontend-styling-system.md](zz-docs/frontend-styling-system.md)
- [zz-docs/frontend-user-flows.md](zz-docs/frontend-user-flows.md)
- [zz-docs/frontend-routing-navigation.md](zz-docs/frontend-routing-navigation.md)
