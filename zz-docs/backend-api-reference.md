# Backend API reference

## Purpose

Provide a code-verified endpoint catalog with effective access behavior based on both route declarations and controller middleware/policies.

Base path: `/api`

## Access-model reminder

Effective access is determined by all three layers:

1. Route-level middleware and explicit `withoutMiddleware(...)`
2. Controller middleware exceptions (`HasMiddleware`)
3. Policy checks via `$this->authorize(...)`

## Core endpoints

### Auth and session

| Method | Path                             | Effective access | Notes                                |
| ------ | -------------------------------- | ---------------- | ------------------------------------ |
| POST   | /login                           | Public           | Throttled `3/min`                    |
| POST   | /register                        | Public           | Creates user + token                 |
| POST   | /logout                          | Auth required    | From `AuthController` middleware     |
| GET    | /me                              | Auth required    | Session probe for frontend           |
| GET    | /email/verify/{id}/{hash}        | Signed link      | Throttled + verifies user            |
| POST   | /email/verification-notification | Auth required    | Throttled + sends verification email |
| POST   | /user/email/change               | Auth required    | Requires `current_password`          |
| GET    | /user/email/confirm/{id}         | Signed link      | Applies email change                 |
| POST   | /password/forgot                 | Public           | Generic anti-enumeration response    |
| POST   | /password/reset                  | Public           | Resets password and revokes tokens   |

### Events and venues

| Method    | Path                  | Effective access | Notes                                              |
| --------- | --------------------- | ---------------- | -------------------------------------------------- |
| GET       | /events               | Public           | Returns `success + data`                           |
| GET       | /events/landing       | Public           | Most popular/last minute/upcoming/featured buckets |
| GET       | /events/search        | Public           | Grouped cursor pagination                          |
| GET       | /events/{event}       | Public           | Increments views with cache window                 |
| GET       | /events/{event}/edit  | Auth required    | Policy-checked update access                       |
| GET       | /events/my            | Auth required    | Current organizer events                           |
| GET       | /events/statistics/my | Auth required    | Organizer stats summary                            |
| POST      | /events               | Auth required    | Organizer/admin create                             |
| PUT/PATCH | /events/{event}       | Auth required    | Policy update                                      |
| DELETE    | /events/{event}       | Auth required    | Policy delete                                      |
| GET       | /venues               | Public           | Policy allows public read                          |
| GET       | /venues/search        | Public           | Filtered venue search                              |
| GET       | /venues/{venue}       | Public           | Public read                                        |
| POST      | /venues               | Auth required    | Admin create only by policy                        |
| PUT/PATCH | /venues/{venue}       | Auth required    | Policy update                                      |
| DELETE    | /venues/{venue}       | Auth required    | Policy delete                                      |

### Tickets, listings, and resale

| Method    | Path                                            | Effective access | Notes                                            |
| --------- | ----------------------------------------------- | ---------------- | ------------------------------------------------ |
| GET       | /activeTickets                                  | Public           | Public list/show by controller exception         |
| GET       | /activeTickets/{activeTicket}                   | Public           | Public show                                      |
| POST      | /activeTickets                                  | Auth required    | Policy create                                    |
| PUT/PATCH | /activeTickets/{activeTicket}                   | Auth required    | Policy update                                    |
| DELETE    | /activeTickets/{activeTicket}                   | Auth required    | Policy delete                                    |
| POST      | /activeTickets/validate                         | Auth required    | Organizer/admin validation path                  |
| POST      | /activeTickets/checkTicket                      | Public           | Throttled (`10/min`)                             |
| POST      | /activeTickets/resell                           | Auth required    | Creates resale listing and deletes active ticket |
| GET       | /originalTickets                                | Public           | Public list/show/search                          |
| GET       | /originalTickets/search                         | Public           | Query by event/seat/status                       |
| GET       | /originalTickets/forSale/{eventId}              | Public           | Active + available tickets                       |
| GET       | /originalTickets/dashboard                      | Auth required    | Joined dashboard list                            |
| POST      | /originalTickets                                | Auth required    | Create ticket                                    |
| PUT/PATCH | /originalTickets/{originalTicket}               | Auth required    | Update ticket                                    |
| DELETE    | /originalTickets/{originalTicket}               | Auth required    | Delete ticket                                    |
| POST      | /originalTickets/bulk                           | Auth required    | Bulk seat generation                             |
| PUT       | /originalTickets/bulk                           | Auth required    | Destructive bulk replace                         |
| POST      | /originalTickets/bulkStatusChange               | Auth required    | Status update + listing sync                     |
| GET       | /ticketForSale                                  | Public           | Public listing/search/show                       |
| GET       | /ticketForSale/search                           | Public           | Listing filters                                  |
| GET       | /ticketForSale/dashboard                        | Auth required    | Current seller dashboard data                    |
| POST      | /ticketForSale                                  | Auth required    | Create listing                                   |
| PUT/PATCH | /ticketForSale/{ticketForSale}                  | Auth required    | Update listing                                   |
| DELETE    | /ticketForSale/{ticketForSale}                  | Auth required    | Delete listing                                   |
| POST      | /ticketForSale/addToBasket/{ticketForSale}      | Public           | Reservation lock + `409` conflict                |
| POST      | /ticketForSale/removeFromBasket/{ticketForSale} | Public           | Removes basket hold                              |
| POST      | /ticketForSale/basketChange/{ticketForSale}     | Auth required    | Toggle basket endpoint                           |
| POST      | /ticketForSale/checkOut                         | Public           | Legacy checkout path                             |
| POST      | /ticketForSale/finalize                         | Public           | Finalization by `orderId`                        |

### Orders, order items, payouts, reviews, users

| Method    | Path                     | Effective access | Notes                                                     |
| --------- | ------------------------ | ---------------- | --------------------------------------------------------- |
| POST      | /orders                  | Public route     | Explicit route removes auth/verified middleware           |
| GET       | /orders/{order}          | Public route     | Uses email fallback when unauthenticated                  |
| PUT/PATCH | /orders/{order}          | Public route     | Explicit route removes auth/verified middleware           |
| GET       | /orders                  | Auth required    | From resource controller                                  |
| DELETE    | /orders/{order}          | Auth required    | From resource controller                                  |
| POST      | /checkout                | Public           | Stripe session create                                     |
| POST      | /orders/checkOut         | Public           | Alias to checkout logic                                   |
| GET       | /checkout/session        | Public           | Stripe session lookup                                     |
| POST      | /orderItems              | Public route     | Explicit route removes auth/verified middleware           |
| PUT/PATCH | /orderItems/{orderItem}  | Public route     | Explicit route removes auth/verified middleware           |
| GET       | /orderItems              | Auth required    | Resource index                                            |
| GET       | /orderItems/{orderItem}  | Auth required    | Resource show                                             |
| DELETE    | /orderItems/{orderItem}  | Auth required    | Resource delete                                           |
| GET       | /payouts                 | Auth required    | Policy-limited view                                       |
| GET       | /payouts/{payout}        | Auth required    | Policy-limited view                                       |
| PUT       | /payouts/{payout}        | Auth required    | Admin update path                                         |
| GET       | /my/payouts              | Auth (intended)  | Declared twice; first declaration has no route middleware |
| GET       | /reviews                 | Public           | Public visible reviews unless admin                       |
| GET       | /reviews/visible         | Public           | Randomized visible subset                                 |
| POST      | /reviews                 | Auth required    | Creates hidden review (`isVisible=false`)                 |
| PUT/PATCH | /reviews/{review}        | Auth required    | Admin policy path                                         |
| DELETE    | /reviews/{review}        | Auth required    | Policy path                                               |
| GET       | /ticketHistory           | Auth + verified  | Policy-controlled                                         |
| GET       | /ticketHistory/myHistory | Auth             | Resell history summary                                    |
| GET       | /ticketHistory/{id}      | Auth + verified  | Numeric constraint                                        |
| POST      | /ticketHistory           | Auth + verified  | Create history row                                        |
| POST      | /tickets/{ticket}/send   | Public route     | Uses order delivery email fallback                        |
| Resource  | /user                    | Auth required    | Self/admin behavior via `UserPolicy`                      |
| GET       | /users/all               | Auth required    | Admin-only in controller logic                            |
| GET       | /users/{user}            | Auth required    | Admin-only in controller logic                            |
| PUT       | /users/{user}            | Auth required    | Admin-only in controller logic                            |
| DELETE    | /users/{user}            | Auth required    | Admin-only in controller logic                            |
| Resource  | /userSettings            | Auth + verified  | Store uses `updateOrCreate(userId=auth()->id())`          |
| POST      | /contact/messages        | Public           | Throttled (`5/min`)                                       |

## Real code examples

### Mixed-access order routes in `api.php`

```php
Route::post('orders', [OrdersController::class, 'store'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orders.store');

Route::apiResource('orders', OrdersController::class)->except(['store', 'show', 'update']);
```

### Public basket reservation with conflict handling

```php
if ($ticketForSale === null) {
    return response()->json([
        'success' => false,
        'message' => 'Ticket is already in another basket.',
    ], 409);
}
```

### Duplicate `my/payouts` declarations

```php
Route::get('my/payouts', [PayoutsController::class, 'myPayouts']);
// ...
Route::get('my/payouts', [PayoutsController::class, 'myPayouts'])->middleware('auth:sanctum');
```

## Known integration notes

- Response envelopes vary (`raw model`, `{success,data}`, `{message}`, etc.).
- Some explicit routes override middleware that controllers normally enforce.
- Policy checks still apply even when route middleware is relaxed.
- `GET /orders/{order}` is intentionally guest-capable with `?email=` fallback guard in the controller.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/permissions.md](zz-docs/permissions.md)
