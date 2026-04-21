# Backend error handling

## Purpose

Describe the real error-handling behavior in the API, including global auth failures, validation responses, and domain-specific conflicts.

## Error model summary

- Centralized: unauthenticated API requests are normalized in bootstrap exception handling.
- Distributed: most business errors are returned from controllers.
- Mixed validation envelopes: custom FormRequest payloads in some requests, Laravel default payloads in others.

## Key files

- Global API exception behavior: [backend/bootstrap/app.php](backend/bootstrap/app.php)
- Auth errors: [backend/app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php)
- Basket conflicts: [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)
- Stripe not-found handling: [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php)
- Password reset failures: [backend/app/Http/Controllers/PasswordResetController.php](backend/app/Http/Controllers/PasswordResetController.php)
- Custom validation wrappers:
  - [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php)
  - [backend/app/Http/Requests/StoreVenueMapRequest.php](backend/app/Http/Requests/StoreVenueMapRequest.php)

## Common non-2xx patterns

| Area                                     | Typical status | Typical payload shape                   |
| ---------------------------------------- | -------------- | --------------------------------------- |
| Missing/invalid auth token               | 401            | `{ message, error }`                    |
| Login invalid credentials                | 401            | `{ success:false, message, data:null }` |
| Login inactive account                   | 403            | `{ success:false, message, data:null }` |
| Validation (default Laravel)             | 422            | `{ message, errors }`                   |
| Validation (custom FormRequest override) | 422            | `{ message, errors }` (explicit)        |
| Basket reservation conflict              | 409            | `{ success:false, message }`            |
| Stripe unknown order                     | 404            | `{ message }`                           |
| Email verify bad signature/hash          | 403            | `{ message }`                           |
| Password reset failed token              | 400            | `{ message }`                           |

## Real code examples

### Global unauthenticated API response

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

### Basket conflict (`409`) when seat is already reserved

```php
if ($ticketForSale === null) {
    return response()->json([
        'success' => false,
        'message' => 'Ticket is already in another basket.',
    ], 409);
}
```

### Custom FormRequest validation payload

```php
throw new HttpResponseException(response()->json([
    'message' => 'The given data was invalid.',
    'errors' => $validator->errors(),
], 422));
```

### Password reset failure mapping

```php
return match ($status) {
    Password::PASSWORD_RESET => response()->json(["message" => "Password reset successfully."], 200),
    default => response()->json(["message" => "Unable to reset password. Please check your email and token and try again."], 400),
};
```

## Practical integration notes

- Frontend clients must support multiple envelope shapes.
- Some endpoints return raw model arrays on success and custom envelope only on failure.
- Route-signature verification failures for signed routes (`email/verify`, `email/confirm`) can short-circuit before controller logic.
- `GET /orders/{order}` can return `403` for guests when `?email=` does not match `buyerEmail`.

## Related docs

- [zz-docs/backend-authentication.md](zz-docs/backend-authentication.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
