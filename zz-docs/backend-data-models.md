# Backend data models

## Purpose

Describe the backend model layer as implemented, including table mappings, key relationships, timestamp behavior, and verified schema/model mismatches.

## Overview

The backend uses Eloquent models mapped to explicit table names, with a mixture of conventional and non-conventional key/link patterns.

- Models are under [backend/app/Models](backend/app/Models).
- Main domain flow spans events -> original tickets -> resale listings -> checkout history/active tickets.
- Commerce flow uses orders/order items, with user linkage by delivery email (`orders.deliveryEmail` -> `users.email`) in [backend/app/Models/User.php](backend/app/Models/User.php#L65).
- Several model definitions do not fully match migration schemas and should be treated as known gaps.

## Key files and locations

- Model directory: [backend/app/Models](backend/app/Models)
- Migration directory: [backend/database/migrations](backend/database/migrations)
- Event model: [backend/app/Models/Event.php](backend/app/Models/Event.php#L9)
- Original ticket model: [backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L8)
- Ticket for sale model: [backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L8)
- Order model: [backend/app/Models/Order.php](backend/app/Models/Order.php#L8)
- Payout model: [backend/app/Models/Payout.php](backend/app/Models/Payout.php#L8)

## Patterns and conventions

### Model inventory and table mappings

- `User` -> `users` ([backend/app/Models/User.php](backend/app/Models/User.php#L22))
- `Event` -> `events` ([backend/app/Models/Event.php](backend/app/Models/Event.php#L14))
- `OriginalTicket` -> `original_tickets` ([backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L13))
- `TicketForSale` -> `ticket_forsale` ([backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L14))
- `ActiveTicket` -> `active_tickets` ([backend/app/Models/ActiveTicket.php](backend/app/Models/ActiveTicket.php#L13))
- `TicketHistory` -> `ticket_history` ([backend/app/Models/TicketHistory.php](backend/app/Models/TicketHistory.php#L13))
- `Order` -> `orders` ([backend/app/Models/Order.php](backend/app/Models/Order.php#L13))
- `OrderItem` -> `order_item` ([backend/app/Models/OrderItem.php](backend/app/Models/OrderItem.php#L13))
- `Payout` -> `payouts` ([backend/app/Models/Payout.php](backend/app/Models/Payout.php#L13))
- `Review` -> `reviews` ([backend/app/Models/Review.php](backend/app/Models/Review.php#L13))
- `VenueMap` -> `venue_maps` ([backend/app/Models/VenueMap.php](backend/app/Models/VenueMap.php#L13))
- `EmailVerification` -> `email_verify` ([backend/app/Models/EmailVerification.php](backend/app/Models/EmailVerification.php#L8))
- `PasswordResetToken` -> `password_reset` ([backend/app/Models/PasswordResetToken.php](backend/app/Models/PasswordResetToken.php#L8))
- `UserSetting` -> `user_settings` ([backend/app/Models/UserSetting.php](backend/app/Models/UserSetting.php#L12))

### High-impact relationships

| Model          | Relationship             | Key                        | Source                                                                             |
| -------------- | ------------------------ | -------------------------- | ---------------------------------------------------------------------------------- |
| Event          | hasMany OriginalTicket   | `eventId`                  | [backend/app/Models/Event.php](backend/app/Models/Event.php#L80)                   |
| OriginalTicket | belongsTo Event          | `eventId`                  | [backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L58) |
| OriginalTicket | hasMany TicketForSale    | `originalTicketId`         | [backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L62) |
| OriginalTicket | hasMany ActiveTicket     | `originalTicketId`         | [backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L66) |
| TicketForSale  | belongsTo OriginalTicket | `originalTicketId`         | [backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L47)   |
| TicketForSale  | belongsTo User           | `fromUserId`               | [backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L52)   |
| Order          | hasMany OrderItem        | `orderId`                  | [backend/app/Models/Order.php](backend/app/Models/Order.php#L40)                   |
| User           | hasMany Order            | `deliveryEmail` -> `email` | [backend/app/Models/User.php](backend/app/Models/User.php#L65)                     |
| User           | hasOne UserSetting       | `userId`                   | [backend/app/Models/User.php](backend/app/Models/User.php#L81)                     |
| Payout         | belongsTo User           | `vendorId`                 | [backend/app/Models/Payout.php](backend/app/Models/Payout.php#L32)                 |

### Search scope patterns

- `Event::scopeSearch` includes text filters, category, max price, and timezone-aware event date filtering in [backend/app/Models/Event.php](backend/app/Models/Event.php#L34).
- `OriginalTicket::scopeSearch` filters by event/seat/status/price/url in [backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L32).
- `TicketForSale::scopeSearch` filters by listing owner/event/price/basket in [backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L25).
- `VenueMap::scopeSearch` filters venue layout fields in [backend/app/Models/VenueMap.php](backend/app/Models/VenueMap.php#L22).

### Timestamp behavior matrix

| Model              | Timestamp behavior                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| User               | Eloquent timestamps + casts (`created_at`, `updated_at`, `lastLogin`)                                                                          |
| Event              | Eloquent timestamps from migration (`timestamps`)                                                                                              |
| OriginalTicket     | Eloquent timestamps from migration                                                                                                             |
| Order              | Eloquent timestamps + extra domain times (`deliveredAt`, `completedAt`, `cancelledAt`)                                                         |
| OrderItem          | Eloquent timestamps from migration                                                                                                             |
| Payout             | Eloquent timestamps from migration                                                                                                             |
| Review             | Eloquent timestamps from migration                                                                                                             |
| UserSetting        | Eloquent timestamps from migration                                                                                                             |
| EmailVerification  | Eloquent timestamps from migration                                                                                                             |
| PasswordResetToken | `public $timestamps = false`; single `created_at` timestamp column                                                                             |
| TicketForSale      | `public $timestamps = false` in [backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L12)                               |
| ActiveTicket       | no timestamps table columns + `public $timestamps = false` in [backend/app/Models/ActiveTicket.php](backend/app/Models/ActiveTicket.php#L29)   |
| TicketHistory      | no timestamps table columns + `public $timestamps = false` in [backend/app/Models/TicketHistory.php](backend/app/Models/TicketHistory.php#L23) |
| VenueMap           | no timestamps table columns + `public $timestamps = false` in [backend/app/Models/VenueMap.php](backend/app/Models/VenueMap.php#L40)           |

## Examples (real code)

### Example 1: Email-based ownership relation

- Order -> User relation uses email key mapping, not user ID:
  - [backend/app/Models/Order.php](backend/app/Models/Order.php#L45)
  - [backend/app/Models/User.php](backend/app/Models/User.php#L71)

### Example 2: Ticket listing timestamps are disabled

- Model-level `public $timestamps = false` in [backend/app/Models/TicketForSale.php](backend/app/Models/TicketForSale.php#L12)
- Migration has no `timestamps()` call in [backend/database/migrations/2026_01_22_024400_create_ticket_forsale_table.php](backend/database/migrations/2026_01_22_024400_create_ticket_forsale_table.php#L14)

### Example 3: User settings primary key is `userId`

- `UserSetting` uses non-incrementing primary key `userId` in [backend/app/Models/UserSetting.php](backend/app/Models/UserSetting.php#L13)
- Migration sets `userId` as primary key in [backend/database/migrations/2026_01_22_024356_create_user_settings_table.php](backend/database/migrations/2026_01_22_024356_create_user_settings_table.php#L14)

## Gotchas and known issues

- `Payout` model defines `orderItemId` and `orderItem()` relation in [backend/app/Models/Payout.php](backend/app/Models/Payout.php#L15), but `payouts` migration does not create `orderItemId` in [backend/database/migrations/2026_01_22_024404_create_payouts_table.php](backend/database/migrations/2026_01_22_024404_create_payouts_table.php#L14).
- `Review` model expects `orderItemId` and `reviewedUserId` in [backend/app/Models/Review.php](backend/app/Models/Review.php#L15), but `reviews` migration currently has neither column in [backend/database/migrations/2026_01_22_024405_create_reviews_table.php](backend/database/migrations/2026_01_22_024405_create_reviews_table.php#L14).
- `PasswordResetToken` uses email as primary key and disables incrementing/timestamps; treat it as a token store model, not a typical Eloquent row with `id` and `updated_at`.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-search-filtering-bulk.md](zz-docs/backend-search-filtering-bulk.md)
- [zz-docs/permissions.md](zz-docs/permissions.md)
