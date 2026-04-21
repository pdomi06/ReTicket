# Environment and deployment

## Purpose

Document runtime configuration and deployment requirements for both backend and frontend.

## Runtime boundaries

- Backend app: `backend/` (Laravel API)
- Frontend app: `frontend/` (React + Vite SPA)

Frontend talks to backend through `VITE_API_BASE_URL`.

## Frontend environment variables

Required:

- `VITE_API_BASE_URL`

Used by contexts/pages and API helpers under `frontend/src`.

## Backend environment variables

Core app/runtime:

- `APP_URL`, `APP_ENV`, `APP_DEBUG`
- `DB_*`
- `QUEUE_CONNECTION`
- `FILESYSTEM_DISK`

Auth/session/recovery:

- Sanctum + auth config uses `auth.php` defaults and guards
- Password reset table is `password_reset`
- `FRONTEND_URL` is used in Stripe redirects and frontend service config

Payment:

- `STRIPE_SECRET`
- `STRIPE_KEY`
- `CASHIER_CURRENCY` (default `huf`)

Mail:

- `MAIL_MAILER`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_ENCRYPTION`
- `MAIL_FROM_ADDRESS`

## Real code examples

### Stripe config mapping

```php
// backend/config/stripe.php
return [
    'sk' => env('STRIPE_SECRET'),
    'pk' => env('STRIPE_KEY'),
];
```

### Queue default

```php
// backend/config/queue.php
'default' => env('QUEUE_CONNECTION', 'database'),
```

### Frontend auth/API base normalization

```ts
const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");
```

## Deployment notes

### Backend (Vercel)

`backend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "public/build"
}
```

### Frontend (Vercel)

`frontend/vercel.json` rewrites all paths to `/` for SPA navigation:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

## Security note

The checked-in [backend/.env.example](backend/.env.example) currently contains concrete-looking credentials/keys. Treat this as sensitive and rotate or sanitize values before sharing publicly.

## Release checklist

1. Set `VITE_API_BASE_URL` to deployed backend `/api` URL.
2. Set backend `FRONTEND_URL` to deployed frontend origin.
3. Configure Stripe secrets in backend environment.
4. Configure mail provider credentials and sender address.
5. Verify CORS for frontend origin.
6. Run a smoke flow: login -> browse -> cart -> checkout -> finalize.

## Related docs

- [zz-docs/local-development-setup.md](zz-docs/local-development-setup.md)
- [zz-docs/backend-payment-processing.md](zz-docs/backend-payment-processing.md)
- [zz-docs/backend-account-recovery.md](zz-docs/backend-account-recovery.md)
