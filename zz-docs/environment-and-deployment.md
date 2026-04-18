# Environment and Deployment

## Runtime Boundaries

- Backend runtime: Laravel application in `backend/`
- Frontend runtime: Vite-built SPA in `frontend/`

The frontend should call backend API endpoints through `VITE_API_BASE_URL`.

## Frontend Environment Variables

Observed runtime variables in code:

- `VITE_API_BASE_URL`

Used by:

- `frontend/src/contexts/cart/CartContext.tsx`
- `frontend/src/contexts/event/EventContext.tsx`
- Multiple dashboard and event page data hooks

## Backend Environment Variables

Laravel backend follows standard `.env` setup for:

- `APP_*` settings
- `DB_*` settings
- CORS/session/security defaults from Laravel config

Payment and checkout related variables used by current code:

- `STRIPE_SECRET`
- `STRIPE_KEY`
- `FRONTEND_URL`
- `CASHIER_CURRENCY` (optional; defaults to `huf` in checkout flow)

Mail delivery is configured through the normal Laravel mailer settings instead of the log channel.

Current local setup uses SMTP with a Gmail account:

- `MAIL_MAILER=smtp`
- `MAIL_HOST=smtp.gmail.com`
- `MAIL_PORT=465`
- `MAIL_USERNAME` for the Gmail account
- `MAIL_PASSWORD` for the Gmail app password
- `MAIL_ENCRYPTION=tls`
- `MAIL_FROM_ADDRESS` set to the verified sender address

If you change providers later, keep the same `MAIL_*` keys and update the host, port, username, and encryption values together.

Keep backend `.env` aligned with database and app URL.

## Build Commands

Backend:

- `npm run build` (from `backend/`) builds frontend assets to `public/build`

Frontend:

- `npm run build` (from `frontend/`) runs `tsc -b && vite build`

## Vercel Notes

Backend Vercel config (`backend/vercel.json`):

- `buildCommand`: `npm run build`
- `outputDirectory`: `public/build`

Frontend Vercel config (`frontend/vercel.json`):

- Rewrites all paths to `/` for SPA routing

## Deployment Checklist

1. Provide frontend `VITE_*` variables in deployment environment.
2. Ensure backend API URL is reachable from deployed frontend origin.
3. Confirm CORS allows frontend origin.
4. Validate SPA rewrite behavior after deployment.
5. Smoke-test dashboard routes and event browse paths.
6. Send a test email through the password reset or email verification flow and confirm it leaves the log channel.
