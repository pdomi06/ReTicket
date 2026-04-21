# Backend authentication

## Purpose

Document the current backend auth/session implementation exactly as it runs: Sanctum token auth, email verification, and authenticated session probing.

## Current auth model

- Token auth: Laravel Sanctum personal access tokens
- User model: custom password column (`passwordHash`) via `getAuthPassword()`
- Verification model: `MustVerifyEmail` on `User`, with custom verification notification
- Session probe endpoint: `GET /api/me`

## Key files

- Auth controller: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php)
- API routes: [backend/routes/api.php](backend/routes/api.php)
- Global unauthenticated JSON response: [backend/bootstrap/app.php](backend/bootstrap/app.php)
- User auth model: [backend/app/Models/User.php](backend/app/Models/User.php)
- Verification notification: [backend/app/Notifications/VerifyEmailNotification.php](backend/app/Notifications/VerifyEmailNotification.php)

## Endpoint surface

| Method | Path                             | Access        | Notes                                  |
| ------ | -------------------------------- | ------------- | -------------------------------------- |
| POST   | /login                           | Public        | Throttled (`throttle:3,1`)             |
| POST   | /register                        | Public        | Creates user + returns token           |
| POST   | /logout                          | Auth required | Deletes current access token           |
| GET    | /me                              | Auth required | Returns `data.user`                    |
| GET    | /email/verify/{id}/{hash}        | Signed link   | Verifies email and marks user verified |
| POST   | /email/verification-notification | Auth required | Re-sends verification notification     |

## Real code examples

### Auth middleware boundary on controller

```php
public static function middleware(): array
{
    return [
        new Middleware('auth:sanctum', except: ['login', 'register']),
    ];
}
```

### Login token lifecycle

```php
if (method_exists($user,'tokens')) {
    $user->tokens()->delete();
}

$token = $user->createToken('api-token')->plainTextToken;
```

### Custom unauthenticated API payload

```php
$exceptions->render(function (AuthenticationException $e, Request $request) {
    if ($request->expectsJson() || $request->is('api/*')) {
        return response()->json(
            ['message' => 'Unauthenticated', 'error' => 'Token missing or invalid'],
            401
        );
    }
});
```

### Verification URL is signed and temporary

```php
return URL::temporarySignedRoute(
    'verification.verify',
    Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
    [
        'id' => $notifiable->getKey(),
        'hash' => sha1($notifiable->getEmailForVerification()),
    ]
);
```

## Behavior notes

- Login updates `lastLogin` and `isOnline`.
- Logout marks user offline and revokes only the current token.
- Register emits `Registered` event and immediately issues a Sanctum token.
- `User::booted()` keeps `isVerified` and `email_verified_at` synchronized.
- There is no refresh-token flow; expired/invalid sessions are expected to re-authenticate.

## Related docs

- [zz-docs/backend-account-recovery.md](zz-docs/backend-account-recovery.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
