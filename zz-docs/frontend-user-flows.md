# Frontend user flows

## Route map and entry points

Primary application routes are declared in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40). Key user-visible entry points:

- Public: `/`, `/welcome`, `/browse`, `/event`, `/vendor`, `/login`, `/register`.
- Account-like pages: `/profile`, `/cart`.
- Dashboard tree: `/dashboard` plus many nested pages (overview, CRUD, history, settings) in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L52).

The nav brand links to `/`, cart links to `/cart`, and seller CTA links to `/vendor` in [frontend/src/components/layout/navbar/navbar.tsx](frontend/src/components/layout/navbar/navbar.tsx#L12).

## Public discovery flow

### Welcome to browse

1. User opens `/` or `/welcome` (same page mapping in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L44)).
2. User can submit the search bar form, which builds query params and navigates to `/browse?...` in [frontend/src/pages/welcome/searchbar/Searchbar.tsx](frontend/src/pages/welcome/searchbar/Searchbar.tsx#L22).
3. `Browse` reads current search params and requests `events/search` from API in [frontend/src/pages/browse/Browse.tsx](frontend/src/pages/browse/Browse.tsx#L8) and [frontend/src/pages/browse/Browse.tsx](frontend/src/pages/browse/Browse.tsx#L16).
4. Each result card links to `/event?event={id}` in [frontend/src/pages/browse/Browse.tsx](frontend/src/pages/browse/Browse.tsx#L70).

### Event details and seat selection

1. `Event` requires `event` query param; without it, page returns "Event not specified." in [frontend/src/pages/event/Event.tsx](frontend/src/pages/event/Event.tsx#L11).
2. `useEventData` loads event details, sibling events, venue map, and active original tickets in [frontend/src/pages/event/useEventData.ts](frontend/src/pages/event/useEventData.ts#L47).
3. `SeatSelector` renders seat matrix and lets user toggle seats in [frontend/src/pages/event/SeatSelector.tsx](frontend/src/pages/event/SeatSelector.tsx#L120).

## Cart and checkout flow

### Add to cart path

1. On seat check, `SeatSelector` calls cart context `addToCart(eventId, row, col)` in [frontend/src/pages/event/SeatSelector.tsx](frontend/src/pages/event/SeatSelector.tsx#L79).
2. `addToCart` resolves original ticket by seat, then finds ticket-for-sale, then adds to backend basket in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L77).
3. On basket failure, local optimistic add is rolled back and `false` is returned in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L127).

### Remove, restore, and clear cart

1. Removing a ticket is optimistic and then synced to backend basket removal in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L140).
2. If remove fails, local state is restored in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L155).
3. On app load, saved cart entries are replayed against backend via `addToBasket` before local restore is accepted in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L10).

### Checkout path

1. `/cart` displays ticket list, subtotal, service fee, and total in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L12).
2. On checkout click, frontend creates an order via `POST /orders` in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L112).
3. Frontend requests Stripe checkout URL with `POST /checkout` and redirects browser in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L154).
4. After Stripe redirect back, frontend reads `session_id` and calls `GET /checkout/session`, then `PATCH /orders/{id}`, then `POST /ticketForSale/finalize` in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L27).
5. On successful completion path, cart is cleared in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L72).

## Authentication and guarded areas

### Login and registration

1. `/login` POSTs to `/login`, stores `user` and `token` in localStorage, then navigates to `/dashboard` in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L29) and [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L52).
2. `/register` POSTs to `/register`, stores `user` and `token`, then navigates to `/dashboard` in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L35) and [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L64).

### Dashboard and profile guard behavior

- `Dashboard` guard checks `token` and redirects to `/login` if missing in [frontend/src/pages/dashboard/Dashboard.tsx](frontend/src/pages/dashboard/Dashboard.tsx#L11).
- `Profile` guard checks parsed `user` and redirects to `/login` if absent in [frontend/src/pages/profile/Profile.tsx](frontend/src/pages/profile/Profile.tsx#L16).

Guard logic is inconsistent (token-based vs user-object-based), so session edge cases can differ between these areas.

## Vendor flow

`/vendor` renders a static marketing-style composition (`Hero`, benefits, stats, process, FAQ, CTA) in [frontend/src/pages/vendor/Vendor.tsx](frontend/src/pages/vendor/Vendor.tsx#L11). This page currently does not implement an authenticated seller onboarding transaction.

## Broken or partial user journeys

- Navbar includes `/about`, but no `/about` route is defined in [frontend/src/components/layout/navbar/navbar.tsx](frontend/src/components/layout/navbar/navbar.tsx#L17) and [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40). This resolves to `*` (NotFound).
- Register form links to `/terms` and `/privacy` in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L92), but those routes are not defined in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40).
- Welcome cards currently use placeholder links like `/brodway` in [frontend/src/pages/welcome/Welcome.tsx](frontend/src/pages/welcome/Welcome.tsx#L22), which are also unmatched routes.

## Operational dependencies

- Frontend requests depend on `VITE_API_BASE_URL`, used directly in multiple flows such as login/register/browse/cart.
- Error handling is per-page and non-uniform (text parsing, JSON parsing, and mixed message extraction patterns).

Where behavior is backend-dependent (for example, exact checkout side effects), see [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md).
