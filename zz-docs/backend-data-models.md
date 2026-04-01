# Backend Data Models

## Model Inventory

Core models in `backend/app/Models/`:

- `User`
- `Event`
- `OriginalTicket`
- `ActiveTicket`
- `TicketForSale`
- `Order`
- `OrderItem`
- `Payout`
- `TicketHistory`
- `Review`
- `VenueMap`
- `EmailVerify`
- `PasswordReset`
- `UserSetting`

## High-Impact Relationships

| Model          | Relationship             | Key                   | Notes                        |
| -------------- | ------------------------ | --------------------- | ---------------------------- |
| Event          | hasMany OriginalTicket   | `eventId`             | Event owns seat inventory    |
| OriginalTicket | belongsTo Event          | `eventId`             | Canonical ticket source      |
| OriginalTicket | hasMany TicketForSale    | `originalTicketId`    | Resale listings              |
| OriginalTicket | hasMany ActiveTicket     | `originalTicketId`    | Active state mapping         |
| TicketForSale  | belongsTo OriginalTicket | `originalTicketId`    | Sale entry per source ticket |
| TicketForSale  | belongsTo User           | `fromUserId`          | Seller identity              |
| Order          | hasMany OrderItem        | `orderId`             | Order line items             |
| Order          | belongsTo User           | `buyerEmail -> email` | Email-based buyer relation   |
| Payout         | belongsTo User           | `vendorId`            | Seller payout owner          |

Note: `Payout` model currently defines an `orderItem()` relation in code, but current migration schema does not include an `orderItemId` column.

## Field and Timestamp Conventions

### Event

Important fields:

- `eventDate`, `eventEndDate`
- `basePrice`
- `createdBy`
- `created_at`, `updated_at`

### OriginalTicket

Important fields:

- `eventId`
- `section`, `row`, `seatNumber`
- `status`
- `ticketPdfUrl`
- `created_at`, `updated_at`

### TicketForSale

Important fields:

- `originalTicketId`
- `fromUserId`
- `eventId`
- `price`
- `inBasket`

### Order

Important fields:

- `buyerEmail`
- `subtotal`, `platformFee`, `tax`
- `status`, `paymentStatus`, `deliverStatus`
- `paymentIntentId`
- `deliveredAt`, `completedAt`, `cancelledAt`
- `created_at`, `updated_at`

### Payout

Important fields:

- `vendorId`
- `orderItemId`
- `status`
- `bank`, `iban`
- `paidAt`
- `created_at`, `updated_at`

## Schema Notes from Current Migrations

- `users` includes `balance` (default `0`) and Laravel timestamps (`created_at`, `updated_at`).
- `events` defines `createdBy` as a foreign key to `users`.
- `orders` stores `deliveredAt`, `completedAt`, and `cancelledAt` plus Laravel timestamps.
- `order_item` stores Laravel timestamps.
- `payouts` stores Laravel timestamps and domain fields such as `vendorId`, `status`, and `paidAt`.

## Timestamp Matrix

| Model          | Timestamp Handling                         |
| -------------- | ------------------------------------------ |
| User           | Uses default `created_at` and `updated_at` |
| Event          | Uses default `created_at` and `updated_at` |
| OriginalTicket | Uses default `created_at` and `updated_at` |
| Order          | Uses default `created_at` and `updated_at` |
| Review         | Uses default `created_at` and `updated_at` |
| UserSetting    | Uses default `created_at` and `updated_at` |
| EmailVerify    | Uses default `created_at` and `updated_at` |
| PasswordReset  | Uses default `created_at` and `updated_at` |
| OrderItem      | Uses default `created_at` and `updated_at` |
| Payout         | Uses default `created_at` and `updated_at` |

## Implementation Notes

- Migration schemas include several fields that are not present in all model `$fillable` arrays. This is expected in the current codebase and should be considered when creating or updating records through mass assignment.

## Ownership Keys Used in Authorization

- Seller ownership: `ticket_forsale.fromUserId == user.id`
- Buyer access: `orders.buyerEmail == user.email`
- Payout visibility: `payouts.vendorId == user.id`

## Search Scope Patterns

Observed model scope usage:

- `Event::search($filters)` for event text/date/category/max price filtering
- `OriginalTicket::search($filters)` for seat and status filtering
- `TicketForSale::search($filters)` for seller/event/basket filtering

See [Backend Search, Filtering, and Bulk Operations](./backend-search-filtering-bulk.md) for behavior details.
