# Backend API Reference

Base path examples assume `/api` prefix from Laravel API routes in `backend/routes/api.php`.

## Authentication

| Method | Path        | Description       |
| ------ | ----------- | ----------------- |
| POST   | `/login`    | User login        |
| POST   | `/register` | User registration |
| POST   | `/logout`   | Logout            |

## Events and Venues

| Method              | Path               | Description                    |
| ------------------- | ------------------ | ------------------------------ |
| GET                 | `/events/search`   | Search events                  |
| GET/POST/PUT/DELETE | `/events` resource | Event CRUD                     |
| GET                 | `/venues/search`   | Search venue maps              |
| GET/POST/PUT/DELETE | `/venues` resource | Venue map CRUD                 |
| GET/POST/PUT/DELETE | `/venue` resource  | Alternate venue map CRUD route |

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
| GET                 | `/originalTickets/dashboard`         | Dashboard ticket listing           |
| POST                | `/originalTickets/bulk`              | Bulk create original tickets       |
| PUT                 | `/originalTickets/bulk`              | Bulk update original tickets       |
| POST                | `/originalTickets/bulkStatusChange`  | Bulk status updates                |
| GET/POST/PUT/DELETE | `/originalTickets` resource          | Original ticket CRUD               |

### Ticket For Sale

| Method              | Path                                              | Description                |
| ------------------- | ------------------------------------------------- | -------------------------- |
| GET                 | `/ticketForSale/search`                           | Filter sale listings       |
| POST                | `/ticketForSale/basketChange/{ticketForSale}`     | Basket toggle/change       |
| POST                | `/ticketForSale/addToBasket/{ticketForSale}`      | Add listing to basket      |
| POST                | `/ticketForSale/removeFromBasket/{ticketForSale}` | Remove listing from basket |
| POST                | `/ticketForSale/checkOut`                         | Checkout selected listings |
| GET/POST/PUT/DELETE | `/ticketForSale` resource                         | Ticket listing CRUD        |

## Commerce

### Orders and Items

| Method              | Path                   | Description               |
| ------------------- | ---------------------- | ------------------------- |
| GET/POST/PUT/DELETE | `/orders` resource     | Order lifecycle CRUD      |
| GET/POST/PUT/DELETE | `/orderItems` resource | Order item lifecycle CRUD |

### Payouts

| Method              | Path                | Description |
| ------------------- | ------------------- | ----------- |
| GET/POST/PUT/DELETE | `/payouts` resource | Payout CRUD |

## Account Recovery and Verification

| Method              | Path                      | Description                    |
| ------------------- | ------------------------- | ------------------------------ |
| GET/POST/PUT/DELETE | `/emailVerify` resource   | Email verification record CRUD |
| GET/POST/PUT/DELETE | `/passwordReset` resource | Password reset record CRUD     |

## User and Profile

| Method              | Path                     | Description        |
| ------------------- | ------------------------ | ------------------ |
| GET/POST/PUT/DELETE | `/user` resource         | User CRUD          |
| GET/POST/PUT/DELETE | `/userSettings` resource | User settings CRUD |

## History and Reviews

| Method              | Path                      | Description         |
| ------------------- | ------------------------- | ------------------- |
| GET/POST/PUT/DELETE | `/ticketHistory` resource | Ticket history CRUD |
| GET/POST/PUT/DELETE | `/reviews` resource       | Review CRUD         |

## Notes for Integrators

- Most non-read operations are protected by controller middleware using `auth:sanctum`.
- Selected read/search endpoints are public (for example event, venue, and listing discovery endpoints).
- Some ownership checks are email-based (`orders.buyerEmail`), not strictly user-id based.
- Keep frontend route usage aligned with backend naming (`/venues` and `/venue` are both registered).
