# Backend API Reference

Base path examples assume `/api` prefix from Laravel API routes.

## Authentication

| Method | Path        | Description       | Auth                  |
| ------ | ----------- | ----------------- | --------------------- |
| POST   | `/login`    | User login        | Public                |
| POST   | `/register` | User registration | Public                |
| POST   | `/logout`   | Logout            | Usually authenticated |

## Events and Venues

| Method              | Path               | Description                     |
| ------------------- | ------------------ | ------------------------------- |
| GET                 | `/events/search`   | Search events                   |
| GET/POST/PUT/DELETE | `/events` resource | Standard CRUD via `apiResource` |
| GET                 | `/venues/search`   | Search venues                   |
| GET/POST/PUT/DELETE | `/venues` resource | Standard CRUD via `apiResource` |

## Ticket Resources

### Active Tickets

| Method              | Path                      | Description        |
| ------------------- | ------------------------- | ------------------ |
| GET/POST/PUT/DELETE | `/activeTickets` resource | Active ticket CRUD |

### Original Tickets

| Method              | Path                                 | Description                        |
| ------------------- | ------------------------------------ | ---------------------------------- |
| GET                 | `/originalTickets/search`            | Filter original tickets            |
| GET                 | `/originalTickets/forSale/{eventId}` | Available for-sale seats for event |
| GET                 | `/originalTickets/dashboard`         | Dashboard-centric ticket listing   |
| POST                | `/originalTickets/bulk`              | Bulk create original tickets       |
| PUT                 | `/originalTickets/bulk`              | Bulk update original tickets       |
| POST                | `/originalTickets/bulkStatusChange`  | Bulk status updates                |
| GET/POST/PUT/DELETE | `/originalTickets` resource          | Standard CRUD                      |

### Ticket For Sale

| Method              | Path                                              | Description                |
| ------------------- | ------------------------------------------------- | -------------------------- |
| GET                 | `/ticketForSale/search`                           | Filter sale listings       |
| POST                | `/ticketForSale/basketChange/{ticketForSale}`     | Basket toggle/change       |
| POST                | `/ticketForSale/addToBasket/{ticketForSale}`      | Add listing to basket      |
| POST                | `/ticketForSale/removeFromBasket/{ticketForSale}` | Remove listing from basket |
| GET/POST/PUT/DELETE | `/ticketForSale` resource                         | Standard CRUD              |

## Commerce

### Orders and Items

| Method              | Path                   | Description          |
| ------------------- | ---------------------- | -------------------- |
| GET/POST/PUT/DELETE | `/orders` resource     | Order lifecycle      |
| GET/POST/PUT/DELETE | `/orderItems` resource | Order item lifecycle |

### Payouts

| Method | Path                | Description          | Notes                     |
| ------ | ------------------- | -------------------- | ------------------------- |
| GET    | `/payouts`          | List payouts         | Policy controlled         |
| GET    | `/payouts/{payout}` | Get one payout       | Policy controlled         |
| PUT    | `/payouts/{payout}` | Update payout        | Usually admin-level       |
| GET    | `/my/payouts`       | Current user payouts | `auth:sanctum` middleware |

## Account Recovery and Verification

| Method | Path                 | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/email/verify/send` | Send verification link |
| POST   | `/email/verify`      | Verify email token     |
| POST   | `/password/forgot`   | Request reset link     |
| POST   | `/password/reset`    | Apply password reset   |

## User and Profile

| Method              | Path                     | Description        |
| ------------------- | ------------------------ | ------------------ |
| GET/POST/PUT/DELETE | `/user` resource         | User CRUD          |
| GET/POST/PUT/DELETE | `/userSettings` resource | User settings CRUD |

## History and Reviews

| Method              | Path                             | Description          | Notes                     |
| ------------------- | -------------------------------- | -------------------- | ------------------------- |
| POST                | `/ticketHistory`                 | Store history event  |                           |
| GET                 | `/ticketHistory`                 | List history         |                           |
| GET                 | `/ticketHistory/{ticketHistory}` | Show history record  |                           |
| GET                 | `/ticketHistory/my/history`      | Current user history | `auth:sanctum` middleware |
| GET/POST/PUT/DELETE | `/reviews` resource              | Reviews CRUD         | Visibility rules apply    |

## Notes for Integrators

- Some access checks are email-based (`buyerEmail`) and not user-ID based.
- Authorization is policy-driven; role matrix is in [Permissions and Role Matrix](./permissions.md).
- Keep frontend route usage aligned with backend naming (`/venues` exists in API routes).
