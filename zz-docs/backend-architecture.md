# Backend architecture

## Purpose

Describe the backend architecture as currently implemented in code: routing model, auth boundaries, persistence layer, and operational hooks.

## Stack summary

- Framework: Laravel 12, PHP 8.2+
- Auth: Sanctum personal access tokens
- Data layer: Eloquent + targeted DB transaction/query-builder operations
- Queue: database connection
- Scheduler: reservation release command every 10 minutes

## Architecture map

1. `routes/api.php` defines endpoint surface.
2. Controller middleware (`HasMiddleware`) controls auth defaults and exceptions.
3. Policies enforce per-resource authorization.
4. Form Requests validate input for search/store/update/bulk operations.
5. Controllers orchestrate transactions and return JSON payloads.
6. Scheduled command cleans stale basket reservations.

## Key files

- Routing: [backend/routes/api.php](backend/routes/api.php)
- Global middleware and exception behavior: [backend/bootstrap/app.php](backend/bootstrap/app.php)
- Policy layer: [backend/app/Policies](backend/app/Policies)
- Domain controllers: [backend/app/Http/Controllers](backend/app/Http/Controllers)
- Scheduler registration: [backend/routes/console.php](backend/routes/console.php)
- Reservation cleanup command: [backend/app/Console/Commands/ReleaseExpiredReservations.php](backend/app/Console/Commands/ReleaseExpiredReservations.php)

## Real code examples

### API guest handling (no redirect, JSON 401)

```php
$middleware->redirectGuestsTo(
    fn (Request $request) => $request->expectsJson() || $request->is('api/*')
        ? null
        : '/login'
);
```

### Controller-level auth with exceptions

```php
new Middleware('auth:sanctum', except: ['index', 'search', 'show', 'checkOut', 'finalize', 'addToBasket', 'removeFromBasket']),
```

### Scheduler command registration

```php
app(ConsoleKernel::class)->addCommands([
    ReleaseExpiredReservations::class,
]);

Schedule::command('tickets:release-expired')
    ->everyTenMinutes()
    ->withoutOverlapping();
```

## Design characteristics

- Access control is intentionally mixed: some public flows are route-open but still policy-aware.
- Checkout orchestration is split across `OrdersController`, `StripeController`, and `TicketForSaleController`.
- Response envelopes are not globally standardized.
- Concurrency-sensitive basket operations are transaction-based and conflict-driven.
- Reservation expiration logic is centralized in `TicketForSale::scopeExpired()` and the scheduled command.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-queue-jobs-scheduling.md](zz-docs/backend-queue-jobs-scheduling.md)
