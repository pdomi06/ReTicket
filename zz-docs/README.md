# ReTicket Documentation

This folder contains the project documentation chunks for backend, frontend, and operations.

## How to Use These Docs

1. Start with onboarding docs to run the project locally.
2. Read backend and frontend architecture docs to understand code organization.
3. Use API and workflow docs while implementing features.
4. Keep `permissions.md` as the authorization source of truth.

## Documentation index

| Filename                                                                         | What it covers                                                                    | Status   |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------- |
| [project-overview.md](./project-overview.md)                                     | High-level project purpose, stack, and major modules.                             | verified |
| [local-development-setup.md](./local-development-setup.md)                       | Local environment setup and development startup workflow.                         | verified |
| [environment-and-deployment.md](./environment-and-deployment.md)                 | Runtime environment variables and deployment-related guidance.                    | verified |
| [troubleshooting.md](./troubleshooting.md)                                       | Common setup/runtime issues and practical fixes.                                  | verified |
| [permissions.md](./permissions.md)                                               | Role and permission matrix used across backend/frontend flows.                    | verified |
| [backend-authentication.md](./backend-authentication.md)                         | Backend auth model, token flow, middleware behavior, and edge cases.              | new      |
| [backend-account-recovery.md](./backend-account-recovery.md)                     | Email verification and password reset endpoint flows and token behavior.          | new      |
| [backend-error-handling.md](./backend-error-handling.md)                         | Backend error response patterns, validation errors, and exception behavior.       | new      |
| [backend-file-storage.md](./backend-file-storage.md)                             | File storage configuration and current upload/storage usage patterns.             | new      |
| [backend-payment-processing.md](./backend-payment-processing.md)                 | Order plus Stripe checkout orchestration and finalize behavior.                   | new      |
| [backend-queue-jobs-scheduling.md](./backend-queue-jobs-scheduling.md)           | Queue/scheduling configuration and current async processing status.               | new      |
| [backend-api-reference.md](./backend-api-reference.md)                           | Endpoint catalog with effective access behavior from real route/controller logic. | updated  |
| [backend-architecture.md](./backend-architecture.md)                             | Verified backend architecture, request lifecycle, and subsystem responsibilities. | updated  |
| [backend-data-models.md](./backend-data-models.md)                               | Core data model entities, relationships, and schema-model notes.                  | updated  |
| [backend-search-filtering-bulk.md](./backend-search-filtering-bulk.md)           | Search/filter/query patterns and bulk operation behavior.                         | updated  |
| [backend-workflows.md](./backend-workflows.md)                                   | End-to-end backend business workflows and state transitions.                      | updated  |
| [frontend-architecture.md](./frontend-architecture.md)                           | Frontend app structure, route layout, and module responsibilities.                | updated  |
| [frontend-state-and-api-integration.md](./frontend-state-and-api-integration.md) | Frontend state ownership, context usage, and backend API integration paths.       | updated  |
| [frontend-styling-system.md](./frontend-styling-system.md)                       | Actual styling architecture (CSS Modules + Bootstrap), patterns, and risks.       | updated  |
| [frontend-user-flows.md](./frontend-user-flows.md)                               | User journeys across discovery, event, cart, auth, and dashboard paths.           | updated  |
| [frontend-component-library.md](./frontend-component-library.md)                 | Shared UI/layout component inventory, contracts, and integration notes.           | new      |
| [frontend-forms-validation.md](./frontend-forms-validation.md)                   | Form implementations, client-side validation patterns, and consistency gaps.      | new      |
| [frontend-routing-navigation.md](./frontend-routing-navigation.md)               | Route definitions, navigation entry points, guards, and route mismatch gaps.      | new      |
| [frontend-error-boundaries.md](./frontend-error-boundaries.md)                   | Current runtime error handling model and boundary/fallback status.                | new      |
| [frontend-authentication.md](./frontend-authentication.md)                       | Frontend auth flow, storage strategy, token propagation, and missing features.    | new      |

## Shared Conventions

- Roles are `admin`, `organizer`, `vendor`, and `guest`.
- Endpoint examples are shown relative to the backend API base URL.
- Model fields use project naming as-is (`eventId`, `fromUserId`, `buyerEmail`) and Laravel timestamps (`created_at`, `updated_at`).
- Ownership checks are documented from currently implemented middleware/policy behavior.
- Frontend runtime API configuration uses `VITE_API_BASE_URL`.

## Update Discipline

When code changes, update docs in the same pull request.

Suggested sequence:

1. Update the relevant backend/frontend chunk.
2. Update cross-links in this file if new chunks are added.
3. Verify any role/permission changes against `permissions.md`.
