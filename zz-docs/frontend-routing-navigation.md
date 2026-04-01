# Frontend routing and navigation

## Scope

This document describes how routing and navigation are currently implemented in the frontend application, including route definitions, layout composition, guard behavior, and known navigation gaps.

## Router setup

Routing is initialized with `BrowserRouter` in [frontend/src/main.tsx](frontend/src/main.tsx#L6).

Route rendering is driven by `useRoutes(routes)` wrapped in `Suspense` in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L12).

All pages in the route table are lazy-loaded in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L6), so route-level code splitting is active by default.

## Route tree

Top-level routes are declared in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40) under a shared layout.

Public/general routes:

- `/` and `/welcome` -> welcome page.
- `/test` -> test page.
- `/login` and `/register` -> auth entry pages.
- `/profile`.
- `/browse`.
- `/event`.
- `/vendor`.
- `/cart`.

Dashboard route:

- `/dashboard` parent with nested child routes in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L52).
- Index child renders dashboard overview.
- Child paths include create/edit/list/history/statistics/admin pages.

Fallback:

- `*` maps to not-found page in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L79).

## Layout-driven navigation shell

All configured routes render through `MainLayout` in [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L8).

Layout responsibilities:

- Renders top navbar for all routes.
- Renders footer for non-dashboard paths.
- Hides footer for any pathname starting with `/dashboard` via [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L10).
- Wraps routed content (`Outlet`) with event and cart context providers.

## Declarative navigation points

### Global navbar links

Configured in [frontend/src/components/layout/navbar/navbar.tsx](frontend/src/components/layout/navbar/navbar.tsx#L12):

- Brand -> `/`.
- Cart -> `/cart`.
- About Us -> `/about`.
- Start selling -> `/vendor`.

### Footer links

Configured in [frontend/src/components/layout/footer/footer.tsx](frontend/src/components/layout/footer/footer.tsx#L28):

- `/privacy`
- `/about`
- `/contact`
- `/terms`

### Dashboard sidebar links

Configured with `NavLink` in [frontend/src/pages/dashboard/sidebar/Sidebar.tsx](frontend/src/pages/dashboard/sidebar/Sidebar.tsx#L57), including:

- `/dashboard`
- `/dashboard/list-tickets`
- `/dashboard/sales-history`
- `/dashboard/my-events`
- `/dashboard/statistics`
- `/dashboard/venues`
- `/dashboard/events`
- `/dashboard/tickets`
- `/dashboard/users`
- `/dashboard/orders`
- `/dashboard/reviews`
- `/dashboard/website`
- `/dashboard/history`
- `/dashboard/user-settings`

## Programmatic navigation flows

Navigation via `useNavigate` is used in several flows:

- Login success redirects to `/dashboard` in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L56).
- Register success redirects to `/dashboard` in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L70).
- Profile guard redirects to `/login` when no stored user in [frontend/src/pages/profile/Profile.tsx](frontend/src/pages/profile/Profile.tsx#L17).
- Dashboard guard redirects to `/login` when token missing in [frontend/src/pages/dashboard/Dashboard.tsx](frontend/src/pages/dashboard/Dashboard.tsx#L11).
- Search bars navigate to `/browse` with generated query params in:
  - [frontend/src/pages/welcome/searchbar/Searchbar.tsx](frontend/src/pages/welcome/searchbar/Searchbar.tsx#L24)
  - [frontend/src/pages/browse/sidebar/Sidebar.tsx](frontend/src/pages/browse/sidebar/Sidebar.tsx#L47)

## Route parameter and query usage

Dynamic route params:

- `edit-venue/:id` and `edit-event/:id` under dashboard in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L59).

Query-driven pages:

- Event page expects `event` query value (`/event?event=...`) as seen in browse card links and event page parsing:
  - [frontend/src/pages/browse/Browse.tsx](frontend/src/pages/browse/Browse.tsx#L74)
  - [frontend/src/pages/event/Event.tsx](frontend/src/pages/event/Event.tsx#L10)

## Guard and access behavior

Current route protection is component-based, not router-middleware-based.

Observed behavior:

- `Dashboard` checks only `localStorage.token`.
- `Profile` checks parsed `localStorage.user`.

This creates an inconsistent guard model across protected pages.

## Known navigation gaps

The following linked destinations are not declared in the router table and currently fall through to not-found (`*`):

- `/about` from navbar/footer.
- `/privacy` from footer and register text.
- `/contact` from footer.
- `/terms` from footer and register text.

Evidence:

- Links are defined in [frontend/src/components/layout/navbar/navbar.tsx](frontend/src/components/layout/navbar/navbar.tsx#L18), [frontend/src/components/layout/footer/footer.tsx](frontend/src/components/layout/footer/footer.tsx#L28), and [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L106).
- Route table does not include these paths in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40).

## Operational notes

- Navigation behavior depends on client-side localStorage state for auth redirects.
- Route-level loading fallback is a simple `Loading...` placeholder in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L11).
- Analytics and speed insights wrappers are mounted at app root in [frontend/src/app/App.tsx](frontend/src/app/App.tsx#L9), independent of route path.

## TBDs

- Role-aware route authorization is TBD at router level; current dashboard sidebar sections are shown together and not gated by route config.
- There is no dedicated route metadata system (for title/breadcrumb/permissions) currently visible in source. TBD whether planned.
