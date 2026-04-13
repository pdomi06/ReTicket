# Backend API reference

## Purpose

Provide a code-verified endpoint catalog for the current backend API, including effective access (public vs auth required) and behavior notes that affect frontend integration.

## Overview

- Route registration lives in [backend/routes/api.php](backend/routes/api.php).
- Effective endpoint protection depends on controller middleware exceptions (not only route definitions).
- API response envelopes are mixed (`{success,data}`, raw models/arrays, and `{message,error}` for unauthenticated JSON requests).

Base path for all routes listed below: `/api`.

## Key files

- Routes: [backend/routes/api.php](backend/routes/api.php)
- Auth middleware pattern: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php)
- Ticket sale and basket behavior: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)
- Orders and checkout prep behavior: [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php)
- Stripe checkout endpoints: [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php)
- Account recovery endpoints: [backend/app/Http/Controllers/EmailVerificationController.php](backend/app/Http/Controllers/EmailVerificationController.php), [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php)
- Global unauthenticated JSON payload: [backend/bootstrap/app.php](backend/bootstrap/app.php)

## Access model notes

- Controller middleware `except` arrays define many public operations.
- `POST /logout` is auth-protected by `AuthController` middleware, even though the route line itself has no explicit route middleware.
- Basket operations (`addToBasket`, `removeFromBasket`) are currently public endpoints.
- `OrdersController` is mixed access: `store` and `update` are public, while `index`, `show`, and `destroy` require auth.
- `authorize(...)` policy checks still apply in many actions, so middleware-level public routes can still return `403` depending on policy logic and record state.

## Endpoint reference

### Authentication

| Method | Path      | Effective access | Notes                              |
| ------ | --------- | ---------------- | ---------------------------------- |
| POST   | /login    | Public           | Throttled (`throttle:3,1`)         |
| POST   | /register | Public           | Returns user + bearer token        |
| POST   | /logout   | Auth required    | Protected by controller middleware |

### Events and venues

| Method    | Path            | Effective access | Notes                                                |
| --------- | --------------- | ---------------- | ---------------------------------------------------- |
| GET       | /events         | Public           | Paginated response (`success`, `data`, `pagination`) |
| GET       | /events/landing | Public           | Upcoming events for landing page (max 12, by date)   |
| GET       | /events/search  | Public           | Search with optional timezone-aware date filtering   |
| GET       | /events/{event} | Public           | Wrapped response (`success`, `data`)                 |
| POST      | /events         | Auth required    | Creates event with `createdBy=auth()->id()`          |
| PUT/PATCH | /events/{event} | Auth required    | Policy-checked update                                |
| DELETE    | /events/{event} | Auth required    | Policy-checked delete                                |
| GET       | /venues         | Public           | Public by middleware exception                       |
| GET       | /venues/search  | Public           | Search endpoint                                      |
| GET       | /venues/{venue} | Public           | Public by middleware exception                       |
| POST      | /venues         | Auth required    | Policy-checked create                                |
| PUT/PATCH | /venues/{venue} | Auth required    | Policy-checked update                                |
| DELETE    | /venues/{venue} | Auth required    | Policy-checked delete                                |

### Ticket and listing resources

| Method    | Path                                            | Effective access | Notes                                                            |
| --------- | ----------------------------------------------- | ---------------- | ---------------------------------------------------------------- |
| GET       | /activeTickets                                  | Public           | Public `index`                                                   |
| GET       | /activeTickets/{activeTicket}                   | Public           | Public `show`                                                    |
| POST      | /activeTickets                                  | Auth required    | Resource create                                                  |
| PUT/PATCH | /activeTickets/{activeTicket}                   | Auth required    | Resource update                                                  |
| DELETE    | /activeTickets/{activeTicket}                   | Auth required    | Resource delete                                                  |
| GET       | /originalTickets                                | Public           | Public `index`                                                   |
| GET       | /originalTickets/{originalTicket}               | Public           | Public `show`                                                    |
| GET       | /originalTickets/search                         | Public           | Search by event/seat/status/etc.                                 |
| GET       | /originalTickets/forSale/{eventId}              | Public           | Returns active available tickets for event                       |
| GET       | /originalTickets/dashboard                      | Auth required    | Dashboard query endpoint                                         |
| POST      | /originalTickets                                | Auth required    | Resource create                                                  |
| PUT/PATCH | /originalTickets/{originalTicket}               | Auth required    | Resource update                                                  |
| DELETE    | /originalTickets/{originalTicket}               | Auth required    | Resource delete                                                  |
| POST      | /originalTickets/bulk                           | Auth required    | Bulk create from venue grid                                      |
| PUT       | /originalTickets/bulk                           | Auth required    | Bulk replace tickets for event                                   |
| POST      | /originalTickets/bulkStatusChange               | Auth required    | Bulk status transition                                           |
| GET       | /ticketForSale                                  | Public           | Public `index`                                                   |
| GET       | /ticketForSale/{ticketForSale}                  | Public           | Public `show`                                                    |
| GET       | /ticketForSale/search                           | Public           | Search listings                                                  |
| POST      | /ticketForSale/checkOut                         | Public           | Legacy checkout path writing `ticket_history` + `active_tickets` |
| POST      | /ticketForSale/finalize                         | Public           | Finalization step by `orderId`                                   |
| POST      | /ticketForSale/addToBasket/{ticketForSale}      | Public           | Returns `409` if already in another basket                       |
| POST      | /ticketForSale/removeFromBasket/{ticketForSale} | Public           | Returns `409` if not currently in basket                         |
| POST      | /ticketForSale/basketChange/{ticketForSale}     | Auth required    | Auth-only toggle endpoint                                        |
| POST      | /ticketForSale                                  | Auth required    | Resource create                                                  |
| PUT/PATCH | /ticketForSale/{ticketForSale}                  | Auth required    | Resource update                                                  |
| DELETE    | /ticketForSale/{ticketForSale}                  | Auth required    | Resource delete                                                  |

### Orders, payments, payouts, and account recovery

| Method    | Path                    | Effective access | Notes                                                          |
| --------- | ----------------------- | ---------------- | -------------------------------------------------------------- |
| GET       | /orders                 | Auth required    | Resource index                                                 |
| GET       | /orders/{order}         | Auth required    | Resource show                                                  |
| POST      | /orders                 | Public           | Creates order + order items + active tickets                   |
| PUT/PATCH | /orders/{order}         | Public           | Public update (used by checkout flow to update payment fields) |
| DELETE    | /orders/{order}         | Auth required    | Resource delete                                                |
| POST      | /orders/checkOut        | Public           | Alias to Stripe checkout action                                |
| POST      | /checkout               | Public           | Creates Stripe checkout session                                |
| GET       | /checkout/session       | Public           | Retrieves Stripe session details                               |
| GET       | /orderItems             | Auth required    | Resource index                                                 |
| GET       | /orderItems/{orderItem} | Auth required    | Resource show                                                  |
| POST      | /orderItems             | Auth required    | Resource create                                                |
| PUT/PATCH | /orderItems/{orderItem} | Auth required    | Resource update                                                |
| DELETE    | /orderItems/{orderItem} | Auth required    | Resource delete                                                |
| GET       | /payouts                | Auth required    | Payout index                                                   |
| GET       | /payouts/{payout}       | Auth required    | Payout show                                                    |
| PUT       | /payouts/{payout}       | Auth required    | Payout update                                                  |
| GET       | /my/payouts             | Auth required    | Current user payouts                                           |
| POST      | /email/verify/send      | Public           | Send verification token flow                                   |
| POST      | /email/verify           | Public           | Verify token flow                                              |
| POST      | /password/forgot        | Public           | Send password reset link flow                                  |
| POST      | /password/reset         | Public           | Apply new password with token                                  |

### User, settings, reviews, and history

| Method    | Path                           | Effective access | Notes                                                   |
| --------- | ------------------------------ | ---------------- | ------------------------------------------------------- |
| GET       | /user                          | Auth required    | Resource index                                          |
| GET       | /user/{user}                   | Auth required    | Resource show                                           |
| POST      | /user                          | Auth required    | Resource create                                         |
| PUT/PATCH | /user/{user}                   | Auth required    | Resource update                                         |
| DELETE    | /user/{user}                   | Auth required    | Resource delete                                         |
| GET       | /userSettings                  | Auth required    | Resource index                                          |
| GET       | /userSettings/{userSetting}    | Auth required    | Resource show                                           |
| POST      | /userSettings                  | Auth required    | Upsert behavior (`updateOrCreate`)                      |
| PUT/PATCH | /userSettings/{userSetting}    | Auth required    | Resource update                                         |
| DELETE    | /userSettings/{userSetting}    | Auth required    | Resource delete                                         |
| GET       | /reviews                       | Public           | Public visible reviews list                             |
| GET       | /reviews/{review}              | Public           | Public `show` route; policy still applies in controller |
| POST      | /reviews                       | Auth required    | Create hidden review (`isVisible=false`)                |
| PUT/PATCH | /reviews/{review}              | Auth required    | Resource update                                         |
| DELETE    | /reviews/{review}              | Auth required    | Resource delete                                         |
| GET       | /ticketHistory                 | Auth required    | Explicit route                                          |
| GET       | /ticketHistory/{ticketHistory} | Auth required    | Explicit route                                          |
| POST      | /ticketHistory                 | Auth required    | Explicit route                                          |

## Notable behavior differences

- Basket endpoints are public and rely on optimistic/concurrency control (`409`) instead of auth ownership checks.
- Checkout has multiple entry points (`/checkout`, `/orders/checkOut`, `/ticketForSale/checkOut`) with different side effects.
- Orders create/update are public in current middleware configuration.
- Error and success response shapes are not globally normalized.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-payment-processing.md](zz-docs/backend-payment-processing.md)
- [zz-docs/backend-account-recovery.md](zz-docs/backend-account-recovery.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
