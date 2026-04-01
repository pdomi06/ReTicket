# ReTicket Documentation

This folder contains the project documentation chunks for backend, frontend, and operations.

## How to Use These Docs

1. Start with onboarding docs to run the project locally.
2. Read backend and frontend architecture docs to understand code organization.
3. Use API and workflow docs while implementing features.
4. Keep `permissions.md` as the authorization source of truth.

## Documentation Map

### Onboarding and Operations

- [Project Overview](./project-overview.md)
- [Local Development Setup](./local-development-setup.md)
- [Environment and Deployment](./environment-and-deployment.md)
- [Troubleshooting](./troubleshooting.md)

### Backend

- [Backend Architecture](./backend-architecture.md)
- [Backend Data Models](./backend-data-models.md)
- [Backend API Reference](./backend-api-reference.md)
- [Backend Workflows](./backend-workflows.md)
- [Backend Search, Filtering, and Bulk Operations](./backend-search-filtering-bulk.md)
- [Permissions and Role Matrix](./permissions.md)

### Frontend

- [Frontend Architecture](./frontend-architecture.md)
- [Frontend User Flows](./frontend-user-flows.md)
- [Frontend State and API Integration](./frontend-state-and-api-integration.md)
- [Frontend Styling System](./frontend-styling-system.md)

## Shared Conventions

- Roles are `admin`, `organizer`, `vendor`, and `guest`.
- Endpoint examples are shown relative to the backend API base URL.
- Model fields use project naming as-is (`eventId`, `fromUserId`, `buyerEmail`, `createdAt`).
- Ownership checks are documented based on policy rules and relation keys.
- Frontend environment variables use `VITE_` prefix.

## Update Discipline

When code changes, update docs in the same pull request.

Suggested sequence:

1. Update the relevant backend/frontend chunk.
2. Update cross-links in this file if new chunks are added.
3. Verify any role/permission changes against `permissions.md`.
