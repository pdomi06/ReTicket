# Backend authentication

## Purpose

Document the backend authentication implementation exactly as it exists today: route exposure, Sanctum token behavior, response shapes, middleware boundaries, and the current session probe used by the frontend.

## Overview

Authentication is implemented with Laravel Sanctum personal access tokens.

- `AuthController` issues bearer tokens on register/login and revokes only the current token on logout.
- `AuthController` also exposes `GET /api/me` for frontend session bootstrap and token validation.
- API guests are not redirected; unauthenticated API requests receive a JSON payload from global exception handling.

## Key files and locations

- Routes for auth endpoints: [backend/routes/api.php](backend/routes/api.php)
- Auth controller logic: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php)
- Auth middleware registration in controller: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php)
- Guard config (`sanctum` guard): [backend/config/auth.php](backend/config/auth.php)
- User auth model behavior (`HasApiTokens`, password field mapping): [backend/app/Models/User.php](backend/app/Models/User.php)
- Global unauthenticated JSON handling: [backend/bootstrap/app.php](backend/bootstrap/app.php)

## Patterns and conventions

### Endpoint surface

- `POST /login` (throttled)
- `POST /register`
- `POST /logout`
- `GET /me`

### Protection model

- `AuthController` applies `auth:sanctum` to all actions except `login` and `register`.
- `GET /me` is protected and returns the current authenticated user.

### Validation model

- `register` validates `name`, `email`, `phone`, `password`, and `password_confirmation` (`confirmed` rule).
- `login` validates `email` and `password`.

### Password handling

- User password is stored in `passwordHash` (not `password`).
- `passwordHash` is cast as `hashed`, and `getAuthPassword()` returns `passwordHash`.

### Token lifecycle

- On login, all existing user tokens are deleted before issuing a new token (`single-session-like` behavior).
- On logout, only `currentAccessToken()` is deleted.
- Token persistence uses `personal_access_tokens` with optional `expires_at` column.

### Response shape conventions for auth

- `register` success: wrapped `{ success, message, data: { user, token, token_type } }`.
- `login` success: same wrapped shape.
- `login` error (`401`/`403`): wrapped `{ success, message, data: null }`.
- `logout` success returns `{ success, message }` without `data`.
- `GET /me` returns `{ success: true, data: { user } }`.
- Unauthenticated global error payload uses `{ message, error }`.

## Gotchas and known issues

- Response envelope is not globally consistent across all backend endpoints; auth uses wrapped responses, but global unauthenticated responses use a different shape.
- `logout` route may appear public in route file, but controller middleware secures it.
- `GET /me` is the frontend's canonical authenticated session probe and returns the current user under `data.user`.
- Login is throttled, register is not throttled by route middleware.
- `passwordHash` naming is non-default for Laravel auth and must be preserved when extending auth behavior.
- No refresh-token flow was found; clients appear to rely on re-login to obtain a new token.
