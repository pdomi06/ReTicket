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
3. Controller middleware enforces `auth:sanctum` where configured.
4. Policy checks apply where policy methods are implemented.
5. Controller executes model query or domain action.
6. JSON response returns API data for frontend consumption.

## API Layer Structure

Key route groups in `api.php`:

- Auth: `login`, `register`, `logout`
- Events and Venues: searchable resources
- Tickets: original tickets, active tickets, tickets for sale, basket actions
- Orders and Order Items
- Account recovery: `emailVerify` and `passwordReset` resources
- Finance and history: payouts, ticket history
- User and user settings resources

## Authorization Model

Policies in `backend/app/Policies/` are intended to define role behavior.

Common pattern:

- Authentication boundaries are actively enforced through controller middleware.
- Some policy classes are currently stubs and return `false` for all actions.
- Public read endpoints exist for discoverability on selected resources.

See [Permissions and Role Matrix](./permissions.md) for the consolidated role view.

## Data Contract Characteristics

- Naming style often uses camelCase domain fields (`eventId`, `fromUserId`, `buyerEmail`) alongside Laravel timestamp fields (`created_at`, `updated_at`).
- Some relationships use email as foreign linkage (`Order` buyer relation via `buyerEmail`).
- Timestamp columns in current migrations use Laravel defaults (`created_at`, `updated_at`) alongside domain date fields.

## Key Extension Points

- Add endpoint behavior in controllers under `backend/app/Http/Controllers/`.
- Add validation rules under `backend/app/Http/Requests/`.
- Add or update authorization in `backend/app/Policies/`.
- Add model scopes and relationships in `backend/app/Models/`.
