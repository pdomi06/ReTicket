# Backend workflows

## Purpose

Describe the major backend workflows as they are currently implemented in controllers and routes, including side effects and access boundaries.

## Overview

Core workflows are split across event/ticket lifecycle actions, basket and resale listing transitions, order plus Stripe payment handling, and account recovery.

- Workflow entry points are routed in [backend/routes/api.php](backend/routes/api.php).
- Access control is primarily controller middleware with `auth:sanctum` plus per-controller exceptions.
- Several domain flows include non-obvious side effects (basket conflicts, status-driven listing sync, active-ticket pre-creation, finalize idempotency checks).

## Key files and locations

- Event flow controller: [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php)
- Ticket inventory flow controller: [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php)
- Listing, basket, finalize flow controller: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)
- Orders and order items: [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php), [backend/app/Http/Controllers/OrderItemsController.php](backend/app/Http/Controllers/OrderItemsController.php)
- Stripe payment flow: [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php)
- Payout flow endpoints: [backend/app/Http/Controllers/PayoutsController.php](backend/app/Http/Controllers/PayoutsController.php)
- Recovery flow endpoints: [backend/app/Http/Controllers/EmailVerificationController.php](backend/app/Http/Controllers/EmailVerificationController.php), [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php)

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
4. `addToBasket` and `removeFromBasket` use conditional updates and return `409` on stale state conflicts.
5. `basketChange` remains auth-required while add/remove are currently public.

Reference: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)

### Workflow 4: Order creation and active-ticket staging

Order creation endpoint: `POST /orders` in [backend/routes/api.php](backend/routes/api.php).

For each requested ticket ID in the payload:

1. Creates an `orders` row with generated `orderNumber`.
2. Loads `ticket_forsale` row by ID.
3. Generates unique `ticketListingId`.
4. Creates `order_item` row.
5. Creates `active_tickets` row.

Reference: [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php)

### Workflow 5: Stripe checkout and return handling

Stripe endpoints:

1. `POST /checkout` (or alias `POST /orders/checkOut`) creates checkout session and returns `url`.
2. `GET /checkout/session?session_id=...` returns payment intent and customer email.
3. Clients update order payment metadata via `PATCH /orders/{order}`.
4. Clients call `POST /ticketForSale/finalize` with `orderId` to finish listing/history transitions.

References: [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php), [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)

### Workflow 6: Legacy checkout endpoint

`POST /ticketForSale/checkOut` still exists and directly inserts into `ticket_history` and `active_tickets`, then deletes source listings.

Reference: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)

### Workflow 7: Account recovery

Email verification flow:

1. `POST /email/verify/send` creates token records for unverified users.
2. `POST /email/verify` validates token, marks user verified, and stamps `verifiedAt`.

Password reset flow:

1. `POST /password/forgot` dispatches reset link through Laravel password broker.
2. `POST /password/reset` validates token and updates `passwordHash`, then revokes existing tokens.

References: [backend/app/Http/Controllers/EmailVerificationController.php](backend/app/Http/Controllers/EmailVerificationController.php), [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php)

### Workflow 8: Payout retrieval

- `GET /payouts` and `GET /payouts/{payout}` provide admin/authorized views.
- `GET /my/payouts` returns payouts filtered by authenticated vendor ID.

Reference: [backend/app/Http/Controllers/PayoutsController.php](backend/app/Http/Controllers/PayoutsController.php)

## Examples (real code)

### Example 1: Concurrent basket conflict handling

- Add/remove basket operations return `409` when row state no longer matches expected `inBasket` state:
  - [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L98)
  - [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L116)

### Example 2: Public checkout route

- Route is declared in [backend/routes/api.php](backend/routes/api.php).
- Controller middleware exception keeps `checkOut` public in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php).

### Example 3: Status-change listing automation

- Active/non-active transitions in bulk status change create/delete resale listings in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L184).

## Gotchas and known issues

- Checkout is public by current middleware exception, which is easy to miss if reading only route declarations.
- Basket operations are race-sensitive and intentionally return `409` in concurrent conditions.
- `bulkUpdate` for original tickets deletes existing ticket and listing rows for an event before reinserting.
- Order creation and payment execution are split between `OrdersController`, `StripeController`, and `TicketForSaleController/finalize`, so clients must execute multiple calls in sequence.
- Both modern (`/orders` + `/checkout` + `/ticketForSale/finalize`) and legacy (`/ticketForSale/checkOut`) checkout paths exist.
- Policies are implemented but unevenly restrictive across resources, so effective access depends on both middleware and policy methods.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-search-filtering-bulk.md](zz-docs/backend-search-filtering-bulk.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
- [zz-docs/backend-payment-processing.md](zz-docs/backend-payment-processing.md)
- [zz-docs/backend-account-recovery.md](zz-docs/backend-account-recovery.md)
