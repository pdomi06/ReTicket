# ReTicket authorization and access matrix

## Purpose

Document effective access control based on route middleware, controller middleware, and policy checks.

## Enforcement layers

1. Route declarations in [backend/routes/api.php](backend/routes/api.php)
2. Controller middleware (`HasMiddleware`) in each controller
3. Policy checks (`$this->authorize(...)`) in controller actions

## Effective access summary

| Resource area         | Public reads                                                               | Auth-required actions                                         | Role/ownership constraints                                               |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Auth/session          | `POST /login`, `POST /register`                                            | `POST /logout`, `GET /me`                                     | Verification routes are signed/throttled                                 |
| Events                | `GET /events`, `GET /events/{id}`, `/events/search`, `/events/landing`     | Create/update/delete + `/events/my` + `/events/statistics/my` | Organizer can mutate own events; admin override                          |
| Venues                | `GET /venues*`                                                             | Create/update/delete                                          | `VenueMapPolicy` allows create for admin only                            |
| Original tickets      | `GET /originalTickets*`, `/forSale/{eventId}`                              | Create/update/delete + bulk + dashboard                       | Organizer for own event or admin                                         |
| Ticket for sale       | `GET /ticketForSale*` + `addToBasket/removeFromBasket/checkOut/finalize`   | Create/update/delete + `basketChange` + dashboard             | Vendor/admin create, owner update/delete                                 |
| Active tickets        | `GET /activeTickets*`, `checkTicket`                                       | create/update/delete, validate, resell                        | Validate requires organizer ownership (or admin override)                |
| Orders                | `POST /orders`, `GET/PUT/PATCH /orders/{id}` (explicit public routes)      | `GET /orders`, `DELETE /orders/{id}`                          | Policy uses buyer/delivery email ownership when authenticated            |
| Order items           | `POST /orderItems`, `PUT/PATCH /orderItems/{id}` (explicit public routes)  | `GET/DELETE` resource routes require auth+verified            | Policy denies non-admin for protected actions                            |
| Payouts               | none                                                                       | all payouts endpoints                                         | Admin broad access; vendor can view own payout rows                      |
| Reviews               | `GET /reviews`, `GET /reviews/visible`, `GET /reviews/{id}` (policy-aware) | create/update/delete                                          | Create for any authenticated user, update/delete effectively admin paths |
| User resource         | none                                                                       | all `/user` resource routes                                   | Self access + admin overrides from policy                                |
| Admin users endpoints | none                                                                       | `/users/all`, `/users/{user}` (GET/PUT/DELETE)                | Manual `role === admin` checks in controller                             |
| User settings         | none                                                                       | `/userSettings` resource routes                               | Auth + verified middleware; owner/admin policy                           |
| Ticket history        | none                                                                       | `/ticketHistory*` endpoints                                   | Auth + verified; policy restricts view scopes                            |

## Real code examples

### Policy admin override pattern

```php
public function before(?User $user, string $ability): ?bool
{
    if ($user && $user->role === 'admin') {
        return true;
    }
    return null;
}
```

### Route-level middleware override example

```php
Route::post('orders', [OrdersController::class, 'store'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orders.store');
```

### Controller-level admin guard for `/users/*`

```php
if ($request->user()->role !== 'admin') {
    return response()->json([
        'success' => false,
        'message' => 'Unauthorized. Admin access required.',
    ], 403);
}
```

## Important caveats

- Route file alone is not enough; controller middleware exceptions and policy checks change effective behavior.
- Some explicit routes intentionally bypass controller middleware defaults.
- `my/payouts` is declared twice in routes; review route list output to confirm final registration order in your environment.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
