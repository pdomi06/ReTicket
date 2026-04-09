# Backend authentication

## Purpose

Document the backend authentication implementation exactly as it exists today: route exposure, Sanctum token behavior, response shapes, middleware boundaries, and known gaps.

## Overview

Authentication is implemented with Laravel Sanctum personal access tokens.

- Stack anchor: `laravel/sanctum` dependency is installed in [backend/composer.json](backend/composer.json#L14).
- `AuthController` issues bearer tokens on register/login and revokes only the current token on logout in [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L39), [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L82), and [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L103).
- API guests are not redirected; unauthenticated API requests receive a JSON payload from global exception handling in [backend/bootstrap/app.php](backend/bootstrap/app.php#L27).

## Key files and locations

- Routes for auth endpoints: [backend/routes/api.php](backend/routes/api.php#L21)
- Auth controller logic: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L11)
- Auth middleware registration in controller: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L13)
- Guard config (`sanctum` guard): [backend/config/auth.php](backend/config/auth.php#L38)
- User auth model behavior (`HasApiTokens`, password field mapping): [backend/app/Models/User.php](backend/app/Models/User.php#L8), [backend/app/Models/User.php](backend/app/Models/User.php#L56)
- Global unauthenticated JSON handling: [backend/bootstrap/app.php](backend/bootstrap/app.php#L25)
- Token storage table migration: [backend/database/migrations/2026_03_13_000000_create_personal_access_tokens_table.php](backend/database/migrations/2026_03_13_000000_create_personal_access_tokens_table.php#L14)

## Patterns and conventions

### Endpoint surface

- `POST /login` (throttled): [backend/routes/api.php](backend/routes/api.php#L21)
- `POST /register`: [backend/routes/api.php](backend/routes/api.php#L22)
- `POST /logout`: [backend/routes/api.php](backend/routes/api.php#L23)

### Protection model

- `AuthController` applies `auth:sanctum` to all actions except `login` and `register`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L15).
- Result: even though `logout` route is defined without explicit route middleware, it is still protected by controller middleware.

### Validation model

- `register` validates `name`, `email`, `phone`, `password`, and `password_confirmation` (`confirmed` rule): [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L21).
- `login` validates `email` and `password`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L53).

### Password handling

- User password is stored in `passwordHash` (not `password`): [backend/app/Models/User.php](backend/app/Models/User.php#L24).
- `passwordHash` is cast as `hashed`, and `getAuthPassword()` returns `passwordHash`: [backend/app/Models/User.php](backend/app/Models/User.php#L52), [backend/app/Models/User.php](backend/app/Models/User.php#L56).

### Token lifecycle

- On login, all existing user tokens are deleted before issuing a new token (`single-session-like` behavior): [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L76).
- On logout, only `currentAccessToken()` is deleted: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L103).
- Token persistence uses `personal_access_tokens` with optional `expires_at` column: [backend/database/migrations/2026_03_13_000000_create_personal_access_tokens_table.php](backend/database/migrations/2026_03_13_000000_create_personal_access_tokens_table.php#L20).

### Response shape conventions for auth

- `register` success: wrapped `{ success, message, data: { user, token, token_type } }`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L41).
- `login` success: same wrapped shape: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L84).
- `login` error (`401`/`403`): wrapped `{ success, message, data: null }`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L61), [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L69).
- `logout` success returns `{ success, message }` without `data`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L109).
- Unauthenticated global error payload uses `{ message, error }`: [backend/bootstrap/app.php](backend/bootstrap/app.php#L29).

## Examples (real code)

### Register flow

- Route definition: [backend/routes/api.php](backend/routes/api.php#L22)
- Validation and create token path: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L20)
- User creation fields include `isActive`, `isVerified`, and `kycStatus`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L27)

### Login flow with account-state check

- Throttled route (`throttle:3,1`): [backend/routes/api.php](backend/routes/api.php#L21)
- Password verification through `Hash::check` + `getAuthPassword`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L60)
- Inactive accounts return `403`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L69)
- Existing tokens deleted before minting new one: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L76)

### Logout flow

- Route: [backend/routes/api.php](backend/routes/api.php#L23)
- Protected by controller-level middleware (not route-level declaration): [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L15)
- Side effect updates `isOnline` to `false`: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php#L100)

### API unauthenticated behavior

- Guest redirect suppression for API requests: [backend/bootstrap/app.php](backend/bootstrap/app.php#L19)
- Custom JSON response for unauthenticated API calls: [backend/bootstrap/app.php](backend/bootstrap/app.php#L27)

## Gotchas and known issues

- Response envelope is not globally consistent across all backend endpoints; auth uses wrapped responses, but global unauthenticated responses use a different shape.
- `logout` route may appear public in route file, but controller middleware secures it.
- Login is throttled, register is not throttled by route middleware.
- `passwordHash` naming is non-default for Laravel auth and must be preserved when extending auth behavior.
- `config/sanctum.php` was not found in this repository at the time of writing; token expiration policy wiring is TBD.
- No refresh-token flow was found; clients appear to rely on re-login to obtain a new token.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-account-recovery.md](zz-docs/backend-account-recovery.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/frontend-authentication.md](zz-docs/frontend-authentication.md)
