# Backend account recovery

## Purpose

Document the current account recovery implementation for email verification and password reset.

## Overview

Account recovery is implemented through dedicated endpoints (not CRUD resources):

- Email verification send/confirm flow.
- Password reset request/confirm flow.

## Key files

- Routes: [backend/routes/api.php](backend/routes/api.php)
- Email verification controller: [backend/app/Http/Controllers/EmailVerificationController.php](backend/app/Http/Controllers/EmailVerificationController.php)
- Password reset controller: [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php)
- Email verification model: [backend/app/Models/EmailVerification.php](backend/app/Models/EmailVerification.php)
- Password reset token model: [backend/app/Models/PasswordResetToken.php](backend/app/Models/PasswordResetToken.php)

## Endpoint map

| Method | Path               | Access | Purpose                                                          |
| ------ | ------------------ | ------ | ---------------------------------------------------------------- |
| POST   | /email/verify/send | Public | Generate and store email verification token for unverified users |
| POST   | /email/verify      | Public | Verify token and mark user as verified                           |
| POST   | /password/forgot   | Public | Request password reset link via Laravel password broker          |
| POST   | /password/reset    | Public | Reset password with token and revoke user API tokens             |

## Email verification flow

### Send verification link

`POST /email/verify/send`:

1. Looks up user by email.
2. Returns generic success message even if user does not exist or is already verified.
3. Deletes previous verification records for the user.
4. Creates new `email_verify` token with 1-day expiry.

Response pattern:

- Always HTTP 200 with generic message to avoid account enumeration.

### Verify token

`POST /email/verify`:

1. Finds `email_verify` row by token.
2. Rejects invalid token.
3. Rejects expired or previously-used token.
4. Marks user `isVerified = true`.
5. Sets `verifiedAt` on token record.

Failure status patterns:

- `400` for invalid/expired/already-used token.
- `404` if linked user record no longer exists.

## Password reset flow

### Request reset link

`POST /password/forgot`:

1. Uses `Password::sendResetLink(...)`.
2. Returns generic message regardless of user existence.
3. Logs warning on non-success/non-invalid-user statuses.

Response pattern:

- Always HTTP 200 with generic message.

### Apply reset

`POST /password/reset`:

1. Uses `Password::reset(...)` with token/email/password payload.
2. Updates `passwordHash` on the user.
3. Deletes all existing sanctum tokens for that user.
4. Emits `PasswordReset` event.

Status patterns:

- `200` on successful reset.
- `400` on invalid token or failed reset.

## Data model notes

- Verification records are stored in `email_verify`.
- Password reset tokens are represented by `PasswordResetToken` mapped to `password_reset`.
- Password reset does not require an authenticated session.

## Known behavior notes

- Both recovery flows intentionally return generic messages for anti-enumeration behavior.
- There is no frontend route/page implementation for these flows in current frontend source.

## Related docs

- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
