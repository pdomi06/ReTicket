# Frontend User Flows

## 1. Public Discovery Flow

1. User lands on `/` or `/welcome`.
2. Navigates to `/browse` to see event listings.
3. Opens `/event` for event-level details and seat selection context.
4. Adds seat selection to cart flow where available.

Dependencies:

- Event and ticket availability API endpoints.
- Consistent event ID filtering across seat views.

## 2. Cart Flow

1. User adds a seat from event page.
2. Cart context resolves original ticket, then ticket-for-sale record.
3. Cart UI at `/cart` renders selected listings.
4. Remove action updates both local state and backend basket endpoint.

Failure handling:

- Add can fail if seat listing is no longer available.
- Remove action rolls back local state if backend call fails.

## 3. Auth Flow

1. User opens `/login` or `/register`.
2. Frontend submits credentials to backend auth endpoints.
3. Session/token behavior is managed by backend auth flow.

Operational requirement:

- `VITE_API_BASE_URL` must be configured.

## 4. Organizer Dashboard Flow

1. Organizer opens `/dashboard`.
2. Creates venue in `/dashboard/create-venue`.
3. Creates event in `/dashboard/create-event`.
4. Bulk-creates tickets tied to created event.
5. Manages existing entities through edit/list pages.

Critical dependency:

- Backend endpoint naming consistency for venue/event resources.

## 5. Vendor Flow

1. Vendor discovers listings and ticket opportunities.
2. Uses listing and basket actions.
3. Tracks sales and settlement views in dashboard sections.

See backend matching process in [Backend Workflows](./backend-workflows.md).
