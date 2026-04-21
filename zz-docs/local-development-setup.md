# Local development setup

## Purpose

Set up and run backend and frontend locally with the same behavior assumptions used by the docs.

## Prerequisites

- PHP 8.2+
- Composer 2+
- Node.js 20+ and npm
- A database supported by Laravel

## Workspace layout

- Backend app: `backend/`
- Frontend app: `frontend/`

## Backend setup

From `backend/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

Optional one-shot setup script:

```bash
composer run setup
```

Run backend dev stack:

```bash
composer run dev
```

This starts:

- `php artisan serve`
- `php artisan queue:listen --tries=1`
- `npm run dev`

## Scheduler note (important)

Reservation release automation (`tickets:release-expired`) is scheduled in app code, but `composer run dev` does not start the scheduler worker.

If you want local behavior to match production scheduling, run a second backend terminal:

```bash
php artisan schedule:work
```

## Frontend setup

From `frontend/`:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Environment variables

### Frontend

Create `frontend/.env` (or `.env.local`):

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Backend (minimum practical set)

Keep backend `.env` aligned with your local runtime:

```bash
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://127.0.0.1:5173
QUEUE_CONNECTION=database
```

For checkout testing, also set:

```bash
STRIPE_SECRET=...
STRIPE_KEY=...
```

For email flows (`/password/forgot`, verification notifications, contact form), configure `MAIL_*` values.

## First boot checklist

1. Backend server responds and frontend can load pages.
2. Frontend uses the expected API base URL.
3. Login/register calls reach backend successfully.
4. Browse page can load events.
5. If testing reservation expiry, `php artisan schedule:work` is running.

## Useful verification commands

From `backend/`:

```bash
php artisan route:list
php artisan route:list --path=checkout
php artisan route:list --path=venues
composer test
```

## Common pitfalls

- Missing `VITE_API_BASE_URL` causes frontend request failures.
- Updating `.env` without clearing config can leave stale backend settings.
- Running only `composer run dev` will not execute scheduled reservation cleanup.
- Some frontend paths still call singular `/venue/*`; backend exposes plural `/venues/*`.

## Related docs

- [environment-and-deployment.md](./environment-and-deployment.md)
- [backend-queue-jobs-scheduling.md](./backend-queue-jobs-scheduling.md)
- [troubleshooting.md](./troubleshooting.md)
