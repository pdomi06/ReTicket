# Troubleshooting

## Setup and Runtime

### Backend does not start

Checks:

1. Confirm you are in `backend/`.
2. Ensure `.env` exists and app key is generated.
3. Run `composer install` and `php artisan key:generate`.
4. Run migrations before first API usage.

### Frontend cannot reach API

Symptoms:

- `fetch` errors or network failures in console.

Checks:

1. Verify `VITE_API_BASE_URL` points to backend `/api` base.
2. Confirm backend server is running.
3. Validate CORS/backend origin compatibility.

### Login or register calls fail

Checks:

1. Verify frontend requests target `VITE_API_BASE_URL`.
2. Confirm backend is running and `/api/login` and `/api/register` are reachable.
3. Validate payload shape against backend Form Request rules.

## API Contract Mismatch

### 404 on venue endpoints from frontend

Observed risk:

- Backend routes expose `/venues` and `/venues/search`.
- Some frontend calls may use `/venue` variants.

Resolution:

1. Standardize frontend calls to backend route names.
2. Re-test dashboard create/edit venue workflows.

### Basket actions feel inconsistent

Possible causes:

- Seat already taken by another user between fetch and reserve.
- Add/remove race from multiple tabs or users.

Resolution:

1. Keep optimistic UI rollback paths in place.
2. Re-fetch seat availability after failed basket update.

### Checkout fails with Stripe key errors

Observed risk:

- Missing or stale `STRIPE_SECRET`/`STRIPE_KEY` values.
- Cached backend config after env changes.

Resolution:

1. Verify backend env values for Stripe and `FRONTEND_URL`.
2. Run `php artisan config:clear` in backend after env changes.
3. Re-test `POST /checkout` and check backend logs.

## Data Consistency

### Wrong seat availability across events

Cause:

- Missing event-specific filtering while mapping seat state.

Resolution:

1. Always filter by current `eventId` in data hooks and mapping logic.
2. Guard invalid event params before deriving availability keys.

## Documentation Maintenance

When behavior changes:

1. Update the relevant chunk in `zz-docs/`.
2. Update cross-links in `zz-docs/README.md`.
3. If authorization changed, update `permissions.md` first.
