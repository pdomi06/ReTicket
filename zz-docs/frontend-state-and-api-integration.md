# Frontend state and API integration

## Purpose

Document state ownership and API integration patterns across auth, loading, event, and cart flows.

## State ownership map

- Auth/session: `AuthProvider`
- Global loading state: `LoadingProvider`
- Event detail cache for current page: `EventContext`
- Cart seat/listing state: `CartContext`
- Page-specific request/error state: local component state

## Key files

- [frontend/src/contexts/auth/AuthContext.tsx](frontend/src/contexts/auth/AuthContext.tsx)
- [frontend/src/contexts/loading/LoadingProvider.tsx](frontend/src/contexts/loading/LoadingProvider.tsx)
- [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx)
- [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx)
- [frontend/src/lib/apiFetch.ts](frontend/src/lib/apiFetch.ts)

## Real code examples

### Shared auth-aware fetch helper

```ts
export async function apiFetch(
  input: RequestInfo | URL,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { includeAuth = true, headers, ...rest } = options;
  const mergedHeaders = new Headers(headers ?? undefined);

  if (!mergedHeaders.has("Accept")) {
    mergedHeaders.set("Accept", "application/json");
  }

  if (includeAuth && !mergedHeaders.has("Authorization")) {
    const { token } = readStoredAuthSession();
    if (token) {
      mergedHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(input, { ...rest, headers: mergedHeaders });

  if (response.status === 401) {
    dispatchAuthSessionExpired();
  }

  return response;
}
```

### Cart flow resolves original ticket -> listing -> basket lock

```tsx
const response = await apiFetch(
  `${apiBaseUrl}/originalTickets/search?eventId=${eventId}&row=${row}&seatNumber=${seat}`,
  {
    includeAuth: false,
    headers: {},
  },
);

const ticket = await apiFetch(
  `${apiBaseUrl}/ticketForSale/search?originalTicketId=${originalTicketId}`,
  {
    includeAuth: false,
    headers: {},
  },
);

const basketRes = await apiFetch(
  `${apiBaseUrl}/ticketForSale/addToBasket/${ticketForSale.id}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  },
);
```

### Event page composite load wrapped in global loader

```tsx
const loadPageDataPromise = (async () => {
  const [eventData, tickets] = await Promise.all([
    getEvent(eventId),
    fetchOriginalTickets(eventId),
  ]);

  // fetch sub-events + venue in parallel
  await Promise.all([fetchSubEventsPromise, fetchVenuePromise]);
})();

void trackPageLoading(loadPageDataPromise);
```

## Integration notes

- Auth/session refresh is centralized; domain pages should avoid custom token plumbing.
- Not all requests currently use `apiFetch`; some pages still use raw `fetch` for endpoint-specific parsing.
- Cart restore logic replays seat reservations on startup and drops invalid stale entries.
- Checkout bridge still uses `orderId` in localStorage as a temporary client-side handoff.

## Related docs

- [zz-docs/frontend-authentication.md](zz-docs/frontend-authentication.md)
- [zz-docs/frontend-global-loader.md](zz-docs/frontend-global-loader.md)
- [zz-docs/frontend-user-flows.md](zz-docs/frontend-user-flows.md)
