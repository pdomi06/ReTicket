# Backend workflows

## Purpose

Describe the major backend workflows as they are currently implemented in controllers and routes, including side effects and access boundaries.

## Overview

Core workflows are split across event/ticket lifecycle actions, resale checkout transitions, and CRUD-style commerce/recovery resources.

- Workflow entry points are routed in [backend/routes/api.php](backend/routes/api.php#L21).
- Access control is primarily controller middleware with `auth:sanctum` plus per-controller exceptions.
- Several domain flows include non-obvious side effects (basket conflicts, status-driven listing sync, checkout history inserts).

## Key files and locations

- Event flow controller: [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L14)
- Ticket inventory flow controller: [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L16)
- Resale and checkout flow controller: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L16)
- Orders and order items: [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php#L11), [backend/app/Http/Controllers/OrderItemsController.php](backend/app/Http/Controllers/OrderItemsController.php#L11)
- Payout workflow endpoints: [backend/app/Http/Controllers/PayoutsController.php](backend/app/Http/Controllers/PayoutsController.php#L11)
- History and recovery resources: [backend/app/Http/Controllers/TicketHistoryController.php](backend/app/Http/Controllers/TicketHistoryController.php#L11), [backend/app/Http/Controllers/EmailVerifyController.php](backend/app/Http/Controllers/EmailVerifyController.php#L11), [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php#L11)

## Patterns and conventions

### Workflow 1: Event creation to ticket inventory

1. Event is created with `POST /events` ([backend/routes/api.php](backend/routes/api.php#L25), [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L99)).
2. Original tickets are created via:
   - `POST /originalTickets` for single tickets ([backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L74)).
   - `POST /originalTickets/bulk` for seat-grid generation ([backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L106)).
3. Ticket set can be rewritten via `PUT /originalTickets/bulk` ([backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L135)).
4. Status can be changed in bulk via `POST /originalTickets/bulkStatusChange` ([backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L168)).

### Workflow 2: Status automation for resale listings

`bulkStatusChange` includes automatic listing synchronization:

- If status changes to `active`, missing `ticket_forsale` records are created.
- If status changes away from `active`, `ticket_forsale` rows for that event are deleted.

Reference: [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L184)

### Workflow 3: Ticket resale and basket flow

1. Listings can be created using `POST /ticketForSale` ([backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L59)).
2. Public discovery uses `GET /ticketForSale` and `GET /ticketForSale/search` ([backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L24), [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L31)).
3. Basket operations:
   - `POST /ticketForSale/addToBasket/{ticketForSale}`
   - `POST /ticketForSale/removeFromBasket/{ticketForSale}`
   - `POST /ticketForSale/basketChange/{ticketForSale}`
4. Add/remove basket operations use conditional updates and return `409` on stale state conflicts.

Reference: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)

### Workflow 4: Checkout side effects

Checkout endpoint: `POST /ticketForSale/checkOut` in [backend/routes/api.php](backend/routes/api.php#L39).

For each ticket ID:

1. Finds listing by ID.
2. Generates unique ULID-style `ticketListingId` with existence check.
3. Runs transaction that:
   - inserts into `ticket_history`
   - inserts into `active_tickets`
   - deletes the source `ticket_forsale` row

References: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L126), [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L156)

### Workflow 5: Orders, order items, and payouts

Orders (`/orders`), order items (`/orderItems`), and payouts (`/payouts`) are currently standard CRUD resources behind `auth:sanctum` middleware:

- [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php#L13)
- [backend/app/Http/Controllers/OrderItemsController.php](backend/app/Http/Controllers/OrderItemsController.php#L13)
- [backend/app/Http/Controllers/PayoutsController.php](backend/app/Http/Controllers/PayoutsController.php#L13)

No orchestration logic linking checkout directly to order/order item/payout creation was found in current controllers. That linkage is TBD.

### Workflow 6: History and recovery resources

- Ticket history resource (`/ticketHistory`) is CRUD with auth middleware: [backend/app/Http/Controllers/TicketHistoryController.php](backend/app/Http/Controllers/TicketHistoryController.php#L13)
- Email verify and password reset resources are CRUD with auth middleware:
  - [backend/app/Http/Controllers/EmailVerifyController.php](backend/app/Http/Controllers/EmailVerifyController.php#L13)
  - [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php#L13)

These resources currently behave as data-record CRUD endpoints rather than end-user token/email workflows. End-user flow orchestration is TBD.

## Examples (real code)

### Example 1: Concurrent basket conflict handling

- Add/remove basket operations return `409` when row state no longer matches expected `inBasket` state:
  - [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L98)
  - [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L116)

### Example 2: Public checkout route

- Route is declared in [backend/routes/api.php](backend/routes/api.php#L39).
- Controller middleware exception keeps `checkOut` public in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21).

### Example 3: Status-change listing automation

- Active/non-active transitions in bulk status change create/delete resale listings in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L184).

## Gotchas and known issues

- Checkout is public by current middleware exception, which is easy to miss if reading only route declarations.
- Basket operations are race-sensitive and intentionally return `409` in concurrent conditions.
- `bulkUpdate` for original tickets deletes existing ticket and listing rows for an event before reinserting.
- Orders/order items/payouts currently run as separate CRUD resources; direct workflow coupling to checkout is not implemented in controller code (TBD).
- Policies largely return `false` in current policy files; practical workflow access is governed mainly by controller middleware.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-search-filtering-bulk.md](zz-docs/backend-search-filtering-bulk.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
