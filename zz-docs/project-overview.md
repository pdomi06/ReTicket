# Project Overview

## Purpose

ReTicket is a ticket resale platform focused on reducing second-hand ticket scams by controlling listing, ordering, and payout flows.

The project is split into:

- `backend/`: Laravel API and domain logic.
- `frontend/`: React + TypeScript single-page application.
- `webpages/`: legacy static prototypes.
- `zz-docs/`: project documentation chunks.

## High-Level Architecture

1. Frontend calls backend REST endpoints using `fetch` and `VITE_API_BASE_URL`.
2. Backend validates input with Form Request classes.
3. Laravel policies enforce role and ownership authorization.
4. Eloquent models represent domain entities and relations.
5. Responses return resource data for frontend rendering and action feedback.

## Domain Terms

- Event: A managed show/concert/sports listing owned by an organizer.
- Original Ticket: The canonical seat ticket attached to an event.
- Ticket For Sale: A resale listing tied to an original ticket and vendor.
- Order and Order Item: Purchase records for buyer checkout.
- Payout: Vendor settlement record linked to sold order items.

## Roles

See [Permissions and Role Matrix](./permissions.md) for full details.

- Admin: platform-wide override access.
- Organizer: manages own events and related tickets.
- Vendor: manages own sale listings and views own payouts.
- Guest: public read-only usage with limited actions.

## Repository Landmarks

- Backend routes: `backend/routes/api.php`
- Backend policies: `backend/app/Policies/`
- Backend models: `backend/app/Models/`
- Frontend router: `frontend/src/app/router.tsx`
- Frontend state contexts: `frontend/src/contexts/`

## Documentation Reading Order for New Contributors

1. [Local Development Setup](./local-development-setup.md)
2. [Environment and Deployment](./environment-and-deployment.md)
3. [Backend Architecture](./backend-architecture.md)
4. [Frontend Architecture](./frontend-architecture.md)
5. [Backend API Reference](./backend-api-reference.md)
