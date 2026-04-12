# Backend payment processing

## Purpose

Document the currently implemented payment flow and Stripe integration points in the backend API.

## Overview

Payment is handled by Stripe Checkout and split across multiple backend endpoints:

1. Order creation (`POST /orders`).
2. Stripe checkout session creation (`POST /checkout` or `POST /orders/checkOut`).
3. Stripe session lookup after redirect (`GET /checkout/session`).
4. Order payment field update (`PATCH /orders/{order}`).
5. Ticket finalization (`POST /ticketForSale/finalize`).

This is an orchestrated flow, not a single endpoint transaction.

## Key files

- Routes: [backend/routes/api.php](backend/routes/api.php)
- Stripe controller: [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php)
- Orders controller: [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php)
- Finalization logic: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)
- Stripe config: [backend/config/stripe.php](backend/config/stripe.php)

## Endpoint map

| Method | Path                    | Access | Purpose                                                 |
| ------ | ----------------------- | ------ | ------------------------------------------------------- |
| POST   | /orders                 | Public | Create order, order items, and active ticket rows       |
| POST   | /checkout               | Public | Create Stripe Checkout session and return redirect URL  |
| POST   | /orders/checkOut        | Public | Alias endpoint to same Stripe checkout method           |
| GET    | /checkout/session       | Public | Retrieve Stripe session/payment details by `session_id` |
| PATCH  | /orders/{order}         | Public | Update payment fields on order                          |
| POST   | /ticketForSale/finalize | Public | Finalize listings and write ticket history entries      |

## Current flow details

### Step 1: Create order

`POST /orders` persists an order and creates:

- one `order_item` row per selected ticket,
- one `active_tickets` row per selected ticket,
- generated `orderNumber` and generated `ticketListingId` values.

### Step 2: Create Stripe session

`POST /checkout`:

- sets Stripe secret key from `config('stripe.sk')`,
- computes session amount from request `total`,
- marks order status/payment status to processing/pending,
- creates Stripe Checkout session,
- returns JSON with `url` if request expects JSON.

### Step 3: Handle redirect callback

After successful redirect back to frontend, client calls:

- `GET /checkout/session?session_id=...` to obtain `payment_id` and customer email,
- `PATCH /orders/{order}` to store payment metadata.

### Step 4: Finalize

`POST /ticketForSale/finalize` with `orderId`:

- loads active tickets for the order,
- checks for existing history entries by `ticketListingId` (idempotency guard),
- inserts missing `ticket_history` rows,
- deletes matching `ticket_forsale` listings.

## Configuration

Required environment values:

- `STRIPE_SECRET`
- `STRIPE_KEY`
- `FRONTEND_URL`

Optional behavior values:

- `CASHIER_CURRENCY` (defaults to `huf`)

Current config reads these in:

- [backend/config/stripe.php](backend/config/stripe.php)
- [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php)

## Response shape notes

- `POST /checkout` success (JSON): `{ "url": "..." }`
- `GET /checkout/session` success: `{ "session_id", "payment_id", "email" }`
- Order and finalize responses use different envelopes and should be consumed per endpoint.

## Known gaps and risks

- Endpoints in this flow are public in current middleware configuration.
- There is no webhook-based reconciliation in this code path.
- A legacy checkout endpoint (`POST /ticketForSale/checkOut`) still exists and performs overlapping responsibilities.
- Response payload conventions are inconsistent across endpoints.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
