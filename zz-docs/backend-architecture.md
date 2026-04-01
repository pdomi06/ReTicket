# Backend Architecture

## Stack

- Laravel 12
- PHP 8.2+
- Sanctum (installed dependency)
- Eloquent ORM
- Form Request validation
- Policy-based authorization

## Request Lifecycle

1. Route in `backend/routes/api.php` maps request to controller action.
2. Form Request validates payload/query when used.
3. Policy authorization checks role and ownership.
4. Controller executes model query or domain action.
5. JSON response returns API data for frontend consumption.

## API Layer Structure

Key route groups in `api.php`:

- Auth: `login`, `register`, `logout`
- Events and Venues: searchable resources
- Tickets: original tickets, active tickets, tickets for sale, basket actions
- Orders and Order Items
- Account recovery: email verification, password reset
- Finance and history: payouts, ticket history
- User and user settings resources

## Authorization Model

Policies in `backend/app/Policies/` define role behavior.

Common pattern:

- `before()` grants full access to `admin` for many resources.
- `organizer` restricted by ownership keys like `organizer_id`.
- `vendor` restricted by seller identity keys like `fromUserId`.
- Several guest-facing read endpoints exist for discoverability.

See [Permissions and Role Matrix](./permissions.md) for the consolidated role view.

## Data Contract Characteristics

- Naming style often uses camelCase DB fields (`eventId`, `fromUserId`, `buyerEmail`, `createdAt`).
- Some relationships use email as foreign linkage (`Order` buyer relation via `buyerEmail`).
- Not all models use Laravel default timestamps; some define `createdAt`/`updatedAt` or disable timestamps.

## Key Extension Points

- Add endpoint behavior in controllers under `backend/app/Http/Controllers/`.
- Add validation rules under `backend/app/Http/Requests/`.
- Add or update authorization in `backend/app/Policies/`.
- Add model scopes and relationships in `backend/app/Models/`.
