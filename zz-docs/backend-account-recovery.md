# Backend account recovery

## Purpose

Document the real account recovery and email-change implementation currently shipped in the backend.

## Current surface

Recovery and account-email flows are split across route closures and controllers:

- Email verification link handling: `GET /email/verify/{id}/{hash}`
- Verification resend: `POST /email/verification-notification`
- Email change request: `POST /user/email/change`
- Email change confirmation: `GET /user/email/confirm/{id}` with signed query params
- Password reset request: `POST /password/forgot`
- Password reset apply: `POST /password/reset`

## Key files

- Routes: [backend/routes/api.php](backend/routes/api.php)
- Password reset controller: [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php)
- Email change controller: [backend/app/Http/Controllers/EmailChangeController.php](backend/app/Http/Controllers/EmailChangeController.php)
- Verification notification: [backend/app/Notifications/VerifyEmailNotification.php](backend/app/Notifications/VerifyEmailNotification.php)
- New-email confirmation notification: [backend/app/Notifications/VerifyNewEmail.php](backend/app/Notifications/VerifyNewEmail.php)
- Password reset model: [backend/app/Models/PasswordResetToken.php](backend/app/Models/PasswordResetToken.php)

## Endpoint map

| Method | Path                             | Access        | Notes                                                      |
| ------ | -------------------------------- | ------------- | ---------------------------------------------------------- |
| GET    | /email/verify/{id}/{hash}        | Signed link   | Throttled (`6/min`), marks user verified                   |
| POST   | /email/verification-notification | Auth required | Sends verification email when not yet verified             |
| POST   | /user/email/change               | Auth required | Validates password, sends signed confirm link to new email |
| GET    | /user/email/confirm/{id}         | Signed link   | Applies email change and updates order emails              |
| POST   | /password/forgot                 | Public        | Always returns generic success text                        |
| POST   | /password/reset                  | Public        | Applies new password and revokes existing tokens           |

## Real code examples

### Verification route closure in `api.php`

```php
Route::get('/email/verify/{id}/{hash}', function (Request $request, string $id, string $hash) {
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid verification link.'], 403);
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return response()->json(['message' => 'Email verified successfully.'], 200);
})->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
```

### Email change uses a temporary signed route

```php
$confirmationUrl = URL::temporarySignedRoute(
    'email.change.confirm',
    Carbon::now()->addMinutes(60),
    [
        'id' => $user->id,
        'new_email' => $request->new_email,
    ]
);
```

### Password reset is anti-enumeration friendly

```php
$status = Password::sendResetLink($request->only('email'));

if ($status !== Password::RESET_LINK_SENT && $status !== Password::INVALID_USER) {
    Log::warning('Password reset link request non-success status', [
        'status' => $status,
        'ip' => $request->ip(),
    ]);
}

return response()->json([
    'message' => 'If a user with that email address exists, we have sent a password reset link.'
], 200);
```

## Behavior notes

- Email verification is not handled by a dedicated `EmailVerificationController`; it is route-closure based plus notifications.
- Email change confirmation updates both `users.email` and historical `orders.buyerEmail` / `orders.deliveryEmail` inside a DB transaction.
- Password reset writes to `passwordHash` and revokes all Sanctum tokens.
- Reset and forgot endpoints intentionally avoid leaking user existence.

## Related docs

- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/environment-and-deployment.md](zz-docs/environment-and-deployment.md)
