# Local Development Setup

## Prerequisites

- PHP 8.2+
- Composer 2+
- Node.js 20+ and npm
- A relational database supported by Laravel config

## Workspace Structure

Run backend and frontend as separate apps:

- Backend app root: `backend/`
- Frontend app root: `frontend/`

## Backend Setup

From `backend/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

Run backend services:

```bash
composer run dev
```

What it starts:

- Laravel API server (`php artisan serve`)
- Queue listener (`php artisan queue:listen --tries=1`)
- Vite dev server for backend assets (`npm run dev`)

Alternative minimal backend run:

```bash
php artisan serve
```

## Frontend Setup

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

## Required Frontend Environment Variables

Create `frontend/.env` (or `.env.local`) with at least:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

## First Boot Validation Checklist

1. Backend is reachable at Laravel serve URL.
2. Frontend dev server loads without TypeScript errors.
3. Login/register flow can call API endpoints.
4. Event browse page can fetch events from API.

## Testing

From `backend/`:

```bash
composer test
```

## Common Setup Pitfalls

- Missing `VITE_API_BASE_URL` causes frontend fetch failures.
- Missing Auth0 values prevents auth provider initialization.
- Backend route naming mismatch can produce 404 errors (see troubleshooting doc).
