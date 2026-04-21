# Troubleshooting

## Purpose

Fast diagnostics for common local runtime and integration failures.

## Setup and runtime issues

### Backend does not start

From `backend/`, run:

```bash
composer install
php artisan key:generate
php artisan migrate
composer run dev
```

If env values changed recently:

```bash
php artisan config:clear
```

### Frontend cannot reach API

Check `frontend/.env`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Confirm backend is actually reachable at that origin and path.

### Auth calls fail (`/login`, `/register`, `/me`)

1. Confirm API base URL points to `/api`.
2. Confirm backend server is running.
3. Check browser network tab for status and response shape.
4. If token state is stale, sign out or clear local auth storage and re-login.

## Route and contract mismatches

### 404 on venue update in dashboard edit venue

Current known mismatch:

- Backend routes are plural (`/venues/*`).
- `EditVenue.tsx` currently calls singular `/venue/${id}`.

Quick validation command:

```bash
php artisan route:list --path=venue
php artisan route:list --path=venues
```

### Basket reserve/remove returns `409`

This is expected conflict behavior when reservation state changed concurrently.

Typical causes:

- Another user tab/user already reserved the seat.
- Reservation already expired/released.

Recommended handling:

1. Keep optimistic rollback logic.
2. Re-fetch seat availability after conflict.

## Checkout and payment issues

### Stripe checkout fails

Verify backend env:

```bash
STRIPE_SECRET=...
STRIPE_KEY=...
FRONTEND_URL=http://127.0.0.1:5173
```

Then clear cached config:

```bash
php artisan config:clear
```

Re-test `POST /checkout` and inspect backend logs for Stripe SDK errors.

### Reservation release is not happening locally

Cause: scheduler is not started by `composer run dev`.

Run in a second backend terminal:

```bash
php artisan schedule:work
```

## Email and contact issues

### Password reset / verification / contact form emails are not sent

Check `MAIL_*` values and sender identity in backend `.env`.

Useful checks:

```bash
php artisan config:clear
php artisan tinker
```

Then send a test notification/mail in Tinker or exercise `POST /contact/messages` from the frontend footer form.

## Data consistency and UI symptoms

### Seat availability appears wrong

1. Ensure event page is using the current `eventId` query param.
2. Confirm original tickets and listing data were loaded for the same event.
3. Refresh after basket conflicts to avoid stale local view state.

## Documentation hygiene

When code behavior changes:

1. Update the relevant file in `zz-docs/`.
2. Update links/index in `zz-docs/README.md`.
3. If access changed, update `permissions.md` and `backend-api-reference.md` together.
