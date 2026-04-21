# ReTicket documentation index

This folder contains implementation-aligned documentation for backend, frontend, and operations.

## Documentation policy

- Docs should be updated in the same PR as code changes.
- Every major behavioral section should include real code examples.
- Access-control claims must be validated against routes, controller middleware, and policies.

## Reading order

1. [project-overview.md](./project-overview.md)
2. [local-development-setup.md](./local-development-setup.md)
3. [environment-and-deployment.md](./environment-and-deployment.md)
4. [backend-architecture.md](./backend-architecture.md)
5. [frontend-architecture.md](./frontend-architecture.md)
6. [backend-api-reference.md](./backend-api-reference.md)
7. [permissions.md](./permissions.md)

## Documentation map

| File                                                                             | Coverage                                       |
| -------------------------------------------------------------------------------- | ---------------------------------------------- |
| [project-overview.md](./project-overview.md)                                     | Platform purpose, module map, domain summary   |
| [local-development-setup.md](./local-development-setup.md)                       | Local install/run/test workflow                |
| [environment-and-deployment.md](./environment-and-deployment.md)                 | Env vars, deployment config, release checklist |
| [troubleshooting.md](./troubleshooting.md)                                       | Common runtime and integration issues          |
| [permissions.md](./permissions.md)                                               | Effective access-control matrix                |
| [backend-architecture.md](./backend-architecture.md)                             | Request lifecycle and backend structure        |
| [backend-authentication.md](./backend-authentication.md)                         | Sanctum auth/session/verification details      |
| [backend-account-recovery.md](./backend-account-recovery.md)                     | Password reset and email-change flows          |
| [backend-api-reference.md](./backend-api-reference.md)                           | Endpoint catalog with effective access         |
| [backend-data-models.md](./backend-data-models.md)                               | Model inventory, relations, key mappings       |
| [backend-search-filtering-bulk.md](./backend-search-filtering-bulk.md)           | Search behavior and bulk mutation flows        |
| [backend-workflows.md](./backend-workflows.md)                                   | End-to-end backend workflows                   |
| [backend-payment-processing.md](./backend-payment-processing.md)                 | Stripe + order + finalize flow                 |
| [backend-file-storage.md](./backend-file-storage.md)                             | Filesystem config and URL-based file usage     |
| [backend-queue-jobs-scheduling.md](./backend-queue-jobs-scheduling.md)           | Queue config and scheduled reservation cleanup |
| [backend-error-handling.md](./backend-error-handling.md)                         | Error envelopes and failure paths              |
| [frontend-architecture.md](./frontend-architecture.md)                           | Frontend app structure and provider boundaries |
| [frontend-authentication.md](./frontend-authentication.md)                       | Frontend auth/session and route guards         |
| [frontend-routing-navigation.md](./frontend-routing-navigation.md)               | Route definitions and navigation flows         |
| [frontend-state-and-api-integration.md](./frontend-state-and-api-integration.md) | Context ownership and API integration patterns |
| [frontend-global-loader.md](./frontend-global-loader.md)                         | Global/contained loader behavior               |
| [frontend-component-library.md](./frontend-component-library.md)                 | Reusable UI/layout component inventory         |
| [frontend-forms-validation.md](./frontend-forms-validation.md)                   | Form validation and submission patterns        |
| [frontend-styling-system.md](./frontend-styling-system.md)                       | Styling stack and token usage                  |
| [frontend-user-flows.md](./frontend-user-flows.md)                               | User journey mapping across features           |
| [frontend-error-boundaries.md](./frontend-error-boundaries.md)                   | Runtime error strategy and boundary status     |
