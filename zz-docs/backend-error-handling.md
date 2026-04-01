# Backend error handling

## Purpose

Describe how backend errors are currently produced and returned in the Laravel API, including global handlers, request validation behavior, and endpoint-specific error responses.

## Overview

Error handling is mixed between a small centralized layer and many local controller/request behaviors.

- Centralized behavior exists for unauthenticated API requests in [backend/bootstrap/app.php](backend/bootstrap/app.php#L25).
- Some Form Requests enforce a custom validation payload in [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php#L40) and [backend/app/Http/Requests/StoreVenueMapRequest.php](backend/app/Http/Requests/StoreVenueMapRequest.php#L35).
- Most other validation and runtime errors use Laravel defaults or explicit per-controller JSON responses.
- No custom `Handler` class was found under `backend/app/Exceptions`.

## Key files and locations

- Global middleware and exception hooks: [backend/bootstrap/app.php](backend/bootstrap/app.php#L1)
- Authentication controller custom 401/403 responses: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L60)
- Ticket basket conflict handling (`409`): [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L98)
- Original ticket not-found business response (`404`): [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L179)
- Custom Form Request validation payloads:
  - [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php#L40)
  - [backend/app/Http/Requests/StoreVenueMapRequest.php](backend/app/Http/Requests/StoreVenueMapRequest.php#L35)

## Patterns and conventions

### Global unauthenticated handling

- API guests are not redirected to login for API requests because guest redirect is disabled for JSON/API paths in [backend/bootstrap/app.php](backend/bootstrap/app.php#L18).
- `AuthenticationException` for API/JSON requests is converted to:
  - HTTP `401`
  - payload `{ "message": "Unauthenticated", "error": "Token missing or invalid" }`
  - source: [backend/bootstrap/app.php](backend/bootstrap/app.php#L27)

### Validation handling

Two different patterns are present:

1. Custom Form Request payload (`422`) in two requests

- `BulkStoreOriginalTicketsRequest` and `StoreVenueMapRequest` throw `HttpResponseException` with:
  - `{ "message": "The given data was invalid.", "errors": ... }`
  - sources: [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php#L42), [backend/app/Http/Requests/StoreVenueMapRequest.php](backend/app/Http/Requests/StoreVenueMapRequest.php#L37)

2. Default Laravel validation behavior elsewhere

- Many controllers use `$request->validate(...)` directly, for example auth and bulk status change:
  - [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L21)
  - [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L170)
- Most Form Requests do not override `failedValidation`, so default Laravel `422` handling applies.

### Controller-level business errors

Controllers return explicit error responses for domain rules and concurrency outcomes.

- Invalid credentials: HTTP `401` with wrapped payload in [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L61)
- Inactive account: HTTP `403` in [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L69)
- Basket conflict on concurrent updates: HTTP `409` in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L98) and [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L116)
- Bulk status change with missing tickets: HTTP `404` in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L179)

### Response envelope inconsistency

Error payload shapes are not standardized globally:

- Global unauthenticated error: `{ message, error }` from [backend/bootstrap/app.php](backend/bootstrap/app.php#L29)
- Auth business errors: `{ success, message, data }` from [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L61)
- Validation custom responses: `{ message, errors }` from Form Requests above
- Some not-found/business responses only include `{ message }`, for example [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L179)

## Examples (real code)

### Example 1: Unauthenticated API request

- Exception render hook: [backend/bootstrap/app.php](backend/bootstrap/app.php#L25)
- API JSON shape and status:
  - status `401`
  - payload `{ message: 'Unauthenticated', error: 'Token missing or invalid' }`
  - [backend/bootstrap/app.php](backend/bootstrap/app.php#L29)

### Example 2: Validation error with custom Form Request payload

- Override location: [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php#L40)
- Payload format:
  - `message`
  - `errors` map from validator
  - status `422`

### Example 3: Concurrency conflict in basket operations

- Conditional update and conflict:
  - add-to-basket conflict: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L92)
  - remove-from-basket conflict: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L110)
- Conflict response status: `409`

### Example 4: Business rule not found case

- No tickets for event in bulk status change returns:
  - status `404`
  - payload `{ message: 'No tickets found for this event' }`
  - [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L179)

## Gotchas and known issues

- There is no single global response envelope for errors across all endpoints.
- Frontend clients must handle multiple error shapes (`message+error`, `success+message+data`, `message+errors`, and `message` only).
- Only unauthenticated behavior is globally customized; most other exceptions rely on default Laravel handling.
- Some Form Requests customize validation payloads while most do not, so `422` response structure is not uniform.
- API behavior for unhandled exceptions (for example generic `500` payload shape) is TBD and depends on environment/debug settings.

## Related docs

- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/troubleshooting.md](zz-docs/troubleshooting.md)
