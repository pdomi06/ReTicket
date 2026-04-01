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
| Payout         | belongsTo OrderItem      | `orderItemId`         | Settlement source            |
| Payout         | belongsTo User           | `vendorId`            | Seller payout owner          |

## Field and Timestamp Conventions

### Event

Important fields:

- `eventDate`, `eventEndDate`
- `basePrice`
- `createdAt`, `updatedAt`

Custom timestamps:

- `CREATED_AT = createdAt`
- `UPDATED_AT = updatedAt`

### OriginalTicket

Important fields:

- `eventId`
- `section`, `row`, `seatNumber`
- `status`
- `ticketPdfUrl`

Custom timestamps:

- `CREATED_AT = createdAt`
- `UPDATED_AT = updatedAt`

### TicketForSale

Important fields:

- `originalTicketId`
- `fromUserId`
- `eventId`
- `price`
- `inBasket`

Timestamp behavior:

- `public $timestamps = false`

### Order

Important fields:

- `buyerEmail`
- `subtotal`, `platformFee`, `tax`
- `status`, `paymentStatus`, `deliverStatus`
- `paymentIntentId`
- `deliveredAt`, `completedAt`, `cancelledAt`

Custom timestamps:

- `CREATED_AT = createdAt`
- `UPDATED_AT = updatedAt`

### Payout

Important fields:

- `vendorId`
- `orderItemId`
- `status`
- `bank`, `iban`
- `paidAt`

Timestamp behavior:

- `public $timestamps = false`

## Schema Notes from Current Migrations

- `users` stores audit fields as `createdAt` and `updatedAt`; `balance` is not defined.
- `events` no longer defines a `createdBy` foreign key.
- `orders` stores `deliveredAt`, `createdAt`, `updatedAt`, `completedAt`, and `cancelledAt` as date fields.
- `order_item` stores only `createdAt` for timestamps.
- `payouts` includes `orderItemId` foreign key and stores `createdAt` only.

## Timestamp Matrix

| Model          | Timestamp Handling                                 |
| -------------- | -------------------------------------------------- |
| User           | `CREATED_AT = createdAt`, `UPDATED_AT = updatedAt` |
| Event          | `CREATED_AT = createdAt`, `UPDATED_AT = updatedAt` |
| OriginalTicket | `CREATED_AT = createdAt`, `UPDATED_AT = updatedAt` |
| Order          | `CREATED_AT = createdAt`, `UPDATED_AT = updatedAt` |
| Review         | `CREATED_AT = createdAt`, `UPDATED_AT = updatedAt` |
| UserSetting    | `CREATED_AT = createdAt`, `UPDATED_AT = updatedAt` |
| EmailVerify    | `public $timestamps = false`                       |
| PasswordReset  | `public $timestamps = false`                       |
| OrderItem      | `public $timestamps = false`                       |
| Payout         | `public $timestamps = false`                       |

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
