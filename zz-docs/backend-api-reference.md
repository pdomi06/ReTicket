# Backend API reference

## Purpose

Provide a code-verified reference for currently registered backend API endpoints, including effective auth exposure and known response/behavior differences.

## Overview

- Route registration is in [backend/routes/api.php](backend/routes/api.php#L21).
- Most resources use `Route::apiResource(...)` plus custom routes for search and bulk operations.
- Effective protection is primarily controller-level `auth:sanctum` middleware using `HasMiddleware` implementations (for example [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L18)).
- Success and error payload envelopes are inconsistent across endpoints and should be consumed per-endpoint.

Base path for all routes below: `/api`.

## Key files and locations

- Route definitions: [backend/routes/api.php](backend/routes/api.php#L21)
- Auth middleware pattern example: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L13)
- Public exceptions on ticket sale endpoints: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21)
- Public exceptions on original tickets endpoints: [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L18)
- Global unauthenticated JSON payload behavior: [backend/bootstrap/app.php](backend/bootstrap/app.php#L27)

## Patterns and conventions

### Route style

- REST routing is built mainly with `Route::apiResource` in [backend/routes/api.php](backend/routes/api.php#L25).
- Search and bulk endpoints are explicit routes outside resource declarations.

### Auth and access model

- Route file alone does not fully show access; controller middleware `except` clauses define public operations.
- Notable public exception: `POST /ticketForSale/checkOut` is public by controller middleware exception in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21).
- `POST /logout` is protected via `AuthController` middleware even though route definition has no explicit route middleware in [backend/routes/api.php](backend/routes/api.php#L23).

### Response shape

- Wrapped shape `{ success, data, message }` appears on some endpoints (for example [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L34) and [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L84)).
- Raw model/array responses appear on many resource endpoints (for example [backend/app/Http/Controllers/ActiveTicketsController.php](backend/app/Http/Controllers/ActiveTicketsController.php#L26)).
- Unauthenticated API errors use `{ message, error }` globally from [backend/bootstrap/app.php](backend/bootstrap/app.php#L29).

## Endpoint reference

### Authentication

| Method | Path      | Effective access | Notes                                                                                                                                        |
| ------ | --------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /login    | Public           | Throttled at route level (`throttle:3,1`) in [backend/routes/api.php](backend/routes/api.php#L21)                                            |
| POST   | /register | Public           | Token issued on success in [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L39)            |
| POST   | /logout   | Auth required    | Protected by controller middleware in [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L16) |

### Events and venues

| Method                    | Path            | Effective access | Notes                                                                                                                                         |
| ------------------------- | --------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GET                       | /events/search  | Public           | Search endpoint in [backend/routes/api.php](backend/routes/api.php#L24)                                                                       |
| GET                       | /events         | Public           | `index` public by exception in [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L19)     |
| GET                       | /events/{event} | Public           | `show` public by exception in [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L19)      |
| POST                      | /events         | Auth required    | Resource create                                                                                                                               |
| PUT/PATCH                 | /events/{event} | Auth required    | Resource update                                                                                                                               |
| DELETE                    | /events/{event} | Auth required    | Resource delete                                                                                                                               |
| GET                       | /venues/search  | Public           | Search endpoint in [backend/routes/api.php](backend/routes/api.php#L26)                                                                       |
| GET                       | /venues         | Public           | `index` public by exception in [backend/app/Http/Controllers/VenueMapController.php](backend/app/Http/Controllers/VenueMapController.php#L19) |
| GET                       | /venues/{venue} | Auth required    | `show` not in exception list                                                                                                                  |
| POST                      | /venues         | Auth required    | Resource create                                                                                                                               |
| PUT/PATCH                 | /venues/{venue} | Auth required    | Resource update                                                                                                                               |
| DELETE                    | /venues/{venue} | Auth required    | Resource delete                                                                                                                               |
| GET/POST/PUT/PATCH/DELETE | /venue...       | Same as /venues  | Alternate resource route family in [backend/routes/api.php](backend/routes/api.php#L28)                                                       |

### Ticket resources

| Method    | Path                                            | Effective access | Notes                                                                                                                                                       |
| --------- | ----------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET       | /activeTickets                                  | Public           | `index` public by exception in [backend/app/Http/Controllers/ActiveTicketsController.php](backend/app/Http/Controllers/ActiveTicketsController.php#L17)     |
| GET       | /activeTickets/{activeTicket}                   | Auth required    | `show` not excluded                                                                                                                                         |
| POST      | /activeTickets                                  | Auth required    | Resource create                                                                                                                                             |
| PUT/PATCH | /activeTickets/{activeTicket}                   | Auth required    | Resource update                                                                                                                                             |
| DELETE    | /activeTickets/{activeTicket}                   | Auth required    | Resource delete                                                                                                                                             |
| GET       | /originalTickets                                | Public           | `index` public by exception in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L21) |
| GET       | /originalTickets/{originalTicket}               | Auth required    | `show` not excluded                                                                                                                                         |
| GET       | /originalTickets/search                         | Public           | Explicit search route                                                                                                                                       |
| GET       | /originalTickets/forSale/{eventId}              | Public           | Explicit availability route                                                                                                                                 |
| GET       | /originalTickets/dashboard                      | Auth required    | Not in exception list                                                                                                                                       |
| POST      | /originalTickets                                | Auth required    | Resource create                                                                                                                                             |
| PUT/PATCH | /originalTickets/{originalTicket}               | Auth required    | Resource update                                                                                                                                             |
| DELETE    | /originalTickets/{originalTicket}               | Auth required    | Resource delete                                                                                                                                             |
| POST      | /originalTickets/bulk                           | Auth required    | Bulk create route                                                                                                                                           |
| PUT       | /originalTickets/bulk                           | Auth required    | Bulk update route                                                                                                                                           |
| POST      | /originalTickets/bulkStatusChange               | Auth required    | Bulk status route                                                                                                                                           |
| GET       | /ticketForSale                                  | Public           | `index` public by exception in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21)     |
| GET       | /ticketForSale/{ticketForSale}                  | Auth required    | `show` not excluded                                                                                                                                         |
| GET       | /ticketForSale/search                           | Public           | Explicit search route                                                                                                                                       |
| POST      | /ticketForSale/checkOut                         | Public           | Intentionally public by middleware exception                                                                                                                |
| POST      | /ticketForSale/basketChange/{ticketForSale}     | Auth required    | Basket toggle route                                                                                                                                         |
| POST      | /ticketForSale/addToBasket/{ticketForSale}      | Auth required    | Returns `409` on conflict in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L98)       |
| POST      | /ticketForSale/removeFromBasket/{ticketForSale} | Auth required    | Returns `409` on conflict in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L116)      |
| POST      | /ticketForSale                                  | Auth required    | Resource create                                                                                                                                             |
| PUT/PATCH | /ticketForSale/{ticketForSale}                  | Auth required    | Resource update                                                                                                                                             |
| DELETE    | /ticketForSale/{ticketForSale}                  | Auth required    | Resource delete                                                                                                                                             |

### Commerce and account resources

| Method                    | Path family    | Effective access | Notes                                                                                                                                       |
| ------------------------- | -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| GET/POST/PUT/PATCH/DELETE | /orders        | Auth required    | Full resource protected in [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php#L17)       |
| GET/POST/PUT/PATCH/DELETE | /orderItems    | Auth required    | Full resource protected                                                                                                                     |
| GET/POST/PUT/PATCH/DELETE | /payouts       | Auth required    | Full resource protected                                                                                                                     |
| GET/POST/PUT/PATCH/DELETE | /emailVerify   | Auth required    | Full resource protected                                                                                                                     |
| GET/POST/PUT/PATCH/DELETE | /passwordReset | Auth required    | Full resource protected                                                                                                                     |
| GET/POST/PUT/PATCH/DELETE | /user          | Auth required    | Full resource protected                                                                                                                     |
| GET/POST/PUT/PATCH/DELETE | /userSettings  | Auth required    | Full resource protected                                                                                                                     |
| GET/POST/PUT/PATCH/DELETE | /ticketHistory | Auth required    | Full resource protected                                                                                                                     |
| GET                       | /reviews       | Public           | `index` public by exception in [backend/app/Http/Controllers/ReviewsController.php](backend/app/Http/Controllers/ReviewsController.php#L17) |
| POST/PUT/PATCH/DELETE     | /reviews...    | Auth required    | Non-index actions protected                                                                                                                 |

## Examples (real code)

### Example 1: Public checkout route despite being a sensitive operation

- Route registration: [backend/routes/api.php](backend/routes/api.php#L39)
- Public exception in controller middleware: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21)

### Example 2: Logout protection coming from controller middleware

- Route declaration: [backend/routes/api.php](backend/routes/api.php#L23)
- Middleware application (`except: ['login', 'register']`): [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L16)

### Example 3: Basket conflict response

- Conditional DB update and `409` return when state changed concurrently: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)

## Gotchas and known issues

- The route file by itself is insufficient for auth mapping; always include controller middleware exceptions.
- API response envelopes are inconsistent across controllers and endpoints.
- `/venues` and `/venue` both exist and can cause client-side naming drift if not standardized.
- `POST /ticketForSale/checkOut` is currently public, which may surprise integrators expecting checkout to require auth.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
