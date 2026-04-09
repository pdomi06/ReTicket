# Backend architecture

## Purpose

Describe the current backend architecture as implemented in code, including stack, request flow, routing/auth model, data access patterns, and key non-obvious behaviors.

## Overview

The backend is a Laravel 12 REST API with Sanctum token auth, mostly Eloquent-based data access, and controller-level middleware for access control.

- Framework/runtime: Laravel 12 + PHP 8.2+ in [backend/composer.json](backend/composer.json#L12).
- Auth package: Sanctum in [backend/composer.json](backend/composer.json#L14).
- API style: REST with heavy `Route::apiResource` usage in [backend/routes/api.php](backend/routes/api.php#L25).
- Database default fallback: SQLite when env is unset in [backend/config/database.php](backend/config/database.php#L19).
- Current env example targets PostgreSQL/Neon (`DB_PORT=5432`) in [backend/.env.example](backend/.env.example#L23).
- Queue default: `database` in [backend/config/queue.php](backend/config/queue.php#L16) and [backend/.env.example](backend/.env.example#L39).
- Filesystem default: `local` in [backend/config/filesystems.php](backend/config/filesystems.php#L16) and [backend/.env.example](backend/.env.example#L38).

## Key files and locations

- Route registration: [backend/routes/api.php](backend/routes/api.php#L21)
- Global API unauthenticated behavior: [backend/bootstrap/app.php](backend/bootstrap/app.php#L27)
- Auth flow and token issuance: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L20)
- Ticket resale/concurrency workflow: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)
- Original ticket status automation: [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L184)
- Model layer: [backend/app/Models](backend/app/Models)
- Validation layer: [backend/app/Http/Requests](backend/app/Http/Requests)

## Patterns and conventions

### Request lifecycle

1. Route resolves to controller action from [backend/routes/api.php](backend/routes/api.php#L21).
2. Form Request or inline validation runs before business logic.
3. `auth:sanctum` is enforced in controller middleware definitions (for example [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L19)).
4. Controller executes query/model updates.
5. JSON response is returned (shape varies by endpoint).

### Routing architecture

- Core resources are exposed using `Route::apiResource` for events, venues, tickets, orders, payouts, reviews, users, and settings in [backend/routes/api.php](backend/routes/api.php#L25).
- Search and workflow endpoints are custom routes (`/search`, bulk operations, basket actions, checkout).
- Venue routes are currently exposed under `/venues` resource paths in [backend/routes/api.php](backend/routes/api.php#L25).

### Authorization architecture

- Role/permission enforcement is manual and mixed; no Spatie package is present in [backend/composer.json](backend/composer.json#L11).
- Access boundaries are primarily controller middleware exceptions rather than route groups.
- Public/protected behavior can be non-obvious from route file alone. Example: checkout is public by exception in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21).

### Error and response architecture

- API responses are not globally normalized.
- Custom unauthenticated API JSON payload is centralized in [backend/bootstrap/app.php](backend/bootstrap/app.php#L29).
- Validation/error payloads differ by endpoint/request class.

### Data access architecture

- Primary data access pattern is Eloquent models and resource controllers.
- Query builder (`DB::table`) is used in concurrency-sensitive ticket-sale flows for atomic state changes and transactional writes:
  - Basket add/remove conditional update in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)
  - Finalize and legacy checkout writes/history inserts in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)
- Payment orchestration is split between [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php), [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php), and [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php).
- Soft deletes are not implemented (no `SoftDeletes` trait usage found in `backend/app/**`; no `deleted_at` migration columns found).

### Infrastructure characteristics

- Queue infrastructure is configured and database-backed by default, but app-level job usage is currently minimal.
- Filesystem supports local/public/s3 disks, but active application flows currently store ticket file references as URL strings (`ticketPdfUrl`) rather than upload pipeline handling.
- Multi-tenancy support is not present in current backend code/config.

## Examples (real code)

### Example 1: API-first unauthenticated behavior

- API guests are not redirected; unauthenticated requests return JSON:
  - redirect override in [backend/bootstrap/app.php](backend/bootstrap/app.php#L18)
  - payload render in [backend/bootstrap/app.php](backend/bootstrap/app.php#L29)

### Example 2: Public checkout exception

- Route exists in [backend/routes/api.php](backend/routes/api.php#L39)
- Controller middleware exception makes it public in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L21)

### Example 3: Concurrency guard in basket updates

- Add-to-basket conditional update and `409` conflict path in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)
- Remove-from-basket conditional update and `409` path in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L110)

### Example 4: Status automation from original ticket changes

- Status transitions create/delete `ticket_forsale` entries in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L184)

## Gotchas and known issues

- Access control is spread across controllers; route inspection alone is insufficient for public/protected mapping.
- Response envelopes vary across endpoints, increasing frontend integration branching.
- Checkout is public by design in current controller middleware configuration.
- Multiple checkout-related endpoints exist with overlapping responsibilities (`/checkout`, `/orders/checkOut`, `/ticketForSale/checkOut`, `/ticketForSale/finalize`).
- Soft delete recovery patterns are unavailable because soft deletes are not implemented.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/permissions.md](zz-docs/permissions.md)
