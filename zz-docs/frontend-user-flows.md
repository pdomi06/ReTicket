# Frontend user flows

## Route map and entry points

Primary application routes are declared in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40). Key user-visible entry points:

- Public: `/`, `/welcome`, `/browse`, `/event`, `/vendor`, `/login`, `/register`.
- Account-like pages: `/profile`, `/cart`.
- Protected dashboard tree: `/dashboard` plus nested pages (overview, CRUD, history, settings).

## Public discovery flow

### Welcome to browse

1. User opens `/` or `/welcome`.
2. User can submit the search bar form, which builds query params and navigates to `/browse?...`.
3. `Browse` reads current search params and requests `events/search` from API.
4. Each result card links to `/event?event={id}`.

### Event details and seat selection

1. `Event` requires `event` query param; without it, page returns “Event not specified.”
2. `useEventData` loads event details, sibling events, venue map, and active original tickets.
3. `SeatSelector` renders the seat matrix and lets the user toggle seats.

## Cart and checkout flow

### Add to cart path

1. On seat check, `SeatSelector` calls cart context `addToCart(eventId, row, col)`.
2. `addToCart` resolves the original ticket by seat, then finds the ticket-for-sale listing, then adds the seat to the backend basket.
3. On basket failure, local optimistic add is rolled back and `false` is returned.

### Remove, restore, and clear cart

1. Removing a ticket is optimistic and then synced to backend basket removal.
2. If remove fails, local state is restored.
3. On app load, saved cart entries are replayed against the backend before local restore is accepted.

### Checkout path

1. `/cart` displays ticket list, subtotal, service fee, and total.
2. On checkout click, frontend creates an order via `POST /orders`.
3. Frontend requests a Stripe checkout URL with `POST /checkout` and redirects the browser.
4. After Stripe redirect back, frontend reads `session_id` and calls `GET /checkout/session`, then updates the order and finalizes ticket state.
5. On successful completion path, cart is cleared.

## Authentication and guarded areas

### Login and registration

1. `/login` POSTs to `/login`, normalizes the returned session, writes it through the shared auth context, then navigates to `/dashboard`.
2. `/register` POSTs to `/register`, normalizes the returned session, writes it through the shared auth context, then navigates to `/dashboard`.

### Dashboard and profile guard behavior

`RequireAuth` wraps `/dashboard`, `/profile`, and `/validate` in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L45) and redirects to `/login` when the shared auth state is missing or expired.

`Profile` and `UserSettings` now read from the shared auth context rather than parsing localStorage directly.

### Session refresh behavior

1. The app validates cached auth against `GET /api/me` on startup through the auth context.
2. It refreshes the session again on focus, visibility change, and a conservative interval so profile changes such as email verification can appear without a manual reload.
3. If a protected request gets a `401`, the shared fetch helper clears the session and the next protected navigation goes to `/login`.

## Vendor flow

`/vendor` renders a static marketing-style composition (`Hero`, benefits, stats, process, FAQ, CTA). This page currently does not implement an authenticated seller onboarding transaction.

## Broken or partial user journeys

- Navbar includes `/about`, but no `/about` route is defined.
- Register form links to `/terms` and `/privacy`, but those routes are not defined.
- Welcome cards currently use placeholder links like `/brodway`, which are also unmatched routes.

## Operational dependencies

- Frontend requests depend on `VITE_API_BASE_URL`.
- Error handling is per-page and non-uniform (text parsing, JSON parsing, and mixed message extraction patterns).
