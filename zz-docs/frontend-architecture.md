# Frontend Architecture

## Stack

- React 19 + TypeScript
- Vite build tooling
- React Router (lazy-loaded route modules)
- Tailwind + Bootstrap + custom/CSS-module styles

## App Entry

`frontend/src/main.tsx`:

1. Creates root render.
2. Mounts `BrowserRouter`.
3. Loads global styles.

## Route Topology

Defined in `frontend/src/app/router.tsx`.

Top-level pages:

- `/`, `/welcome`
- `/login`, `/register`
- `/profile`
- `/browse`
- `/event`
- `/vendor`
- `/cart`
- `/dashboard/*`
- fallback `*` for not-found

Dashboard nested routes:

- overview index
- create/edit venue
- create/edit event
- list tickets
- my events
- sales
- venues
- events
- tickets

## Structural Folders

- `frontend/src/pages/`: route-level features
- `frontend/src/components/`: reusable layout and UI
- `frontend/src/contexts/`: shared state containers
- `frontend/src/utils/`: interfaces, enums, defaults
- `frontend/src/styles/`: global style entry

## Layout Pattern

Main layout wraps all routes and centralizes app shell concerns.

This pattern keeps navbar/footer style and navigation behavior consistent across pages.

## Data Access Pattern

Current implementation primarily uses `fetch` directly in page and context logic.

Implication:

- Fast iteration, but request behavior can diverge between modules.
- Shared conventions should be documented and eventually centralized.

See [Frontend State and API Integration](./frontend-state-and-api-integration.md).
