# Frontend State and API Integration

## Environment Variables Used by Frontend

- `VITE_API_BASE_URL`
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`

## Context: EventContext

Location: `frontend/src/contexts/event/EventContext.tsx`

Responsibilities:

- Stores current event object.
- Exposes `getEvent(id)` for event detail loading.
- Validates response success and JSON content type before state update.

Behavior notes:

- On failed fetch or non-JSON response, event state resets to `undefined`.

## Context: CartContext

Location: `frontend/src/contexts/cart/CartContext.tsx`

Responsibilities:

- Stores selected tickets for cart view.
- Adds seat to cart by chaining API calls:
  1. original ticket lookup
  2. ticket-for-sale lookup
  3. add-to-basket backend action
- Removes seat from cart with backend synchronization.

Resilience behavior:

- Add operation returns boolean success/failure.
- Remove operation optimistically updates local state and rolls back on API failure.

## API Interaction Pattern

Current pattern is direct `fetch` calls inside contexts/pages.

## Contract Shape Notes

- Frontend interfaces now consistently use camelCase audit fields (`createdAt`, `updatedAt`) instead of snake_case variants.
- `IEventForm` now retains the same core event fields as `IEvent` and only remaps `eventDate` and `eventEndDate` to allow datetime-local input values.
- The dashboard edit-event page normalizes API event payloads using object spread and then converts the two date fields for form controls.
- Several interfaces now represent some fields as required values where they were previously nullable in TypeScript types (for example order date fields).

Recommended conventions for consistency:

1. Always use `encodeURIComponent` for route/query params from user input.
2. Always check `response.ok` before JSON parse.
3. Normalize success/error object shape in a shared helper when possible.
4. Keep endpoint paths aligned with backend route names (`/venues` and `/venue` are both currently registered).

## Integration Risk Hotspots

- Endpoint naming mismatches between frontend and backend.
- Event-seat data mixing if event-scoped filtering is skipped.
- Race conditions in basket update during concurrent purchases.

See [Troubleshooting](./troubleshooting.md) for observed examples.
