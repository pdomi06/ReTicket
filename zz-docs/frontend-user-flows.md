# Frontend user flows

## Purpose

Describe the major user journeys and how they map to current frontend/backend calls.

## Core journeys

### 1. Discover events

1. User opens `/` or `/welcome`.
2. Searchbar/sidebar builds query params and navigates to `/browse`.
3. Browse fetches `/events/search` and renders cards.
4. User opens event details via `/event?event=<id>`.

### 2. Select seats and reserve

1. Event page loads event, venue, and active original tickets.
2. Seat selection triggers `addToCart(eventId,row,seat)`.
3. Cart context resolves original ticket and listing.
4. Cart context calls `POST /ticketForSale/addToBasket/{id}`.

### 3. Checkout and finalize

1. Cart calls `POST /orders`.
2. Cart calls `POST /checkout` and redirects to Stripe URL.
3. Return path reads `session_id`, then calls `GET /checkout/session`.
4. Frontend updates order payment fields (`PATCH /orders/{id}`).
5. Frontend calls `POST /ticketForSale/finalize`.

### 4. Auth/session journey

1. Login/register submit credentials to `/login` or `/register`.
2. Auth session is normalized and stored via `setSession`.
3. Guarded routes (`/profile`, `/validate`, `/dashboard/*`) use `RequireAuth`.
4. Session refresh uses `/me` on startup/focus/visibility/interval.

### 5. Footer contact journey

1. User submits footer form.
2. Frontend calls `POST /contact/messages`.
3. Inline notification displays success/failure.

## Real code examples

### Search flow navigation

```tsx
navigate({
  pathname: "/browse",
  search: `?${createSearchParams(params)}`,
});
```

### Checkout chain from cart page

```tsx
const response = await fetch(`${apiBaseUrl}/orders`, { method: "POST", ... });
const checkoutResponse = await fetch(`${apiBaseUrl}/checkout`, { method: "POST", ... });
window.location.assign(data.url);
```

### Auth completion redirect

```tsx
setSession({ user, token: data.data.token });
navigate("/dashboard");
```

## Notes

- Static pages (`/about`, `/contact`, `/terms`, `/privacy`) are now part of the live route tree.
- Cart flow intentionally keeps local fallback state for optimistic UX and rollback.
- Dashboard pages use contained loader while non-dashboard pages can use global overlay.

## Related docs

- [zz-docs/frontend-routing-navigation.md](zz-docs/frontend-routing-navigation.md)
- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
