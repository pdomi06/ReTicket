# Backend data models

## Purpose

Capture the current domain model layer (tables, key relations, and notable non-standard mappings).

## Model inventory

- `User` -> `users`
- `Event` -> `events`
- `VenueMap` -> `venue_maps`
- `OriginalTicket` -> `original_tickets`
- `TicketForSale` -> `ticket_forsale`
- `ActiveTicket` -> `active_tickets`
- `TicketHistory` -> `ticket_history`
- `Order` -> `orders`
- `OrderItem` -> `order_item`
- `Payout` -> `payouts`
- `Review` -> `reviews`
- `UserSetting` -> `user_settings`
- `PasswordResetToken` -> `password_reset`

## Key relationships

| Source         | Relation  | Target         | Notes                      |
| -------------- | --------- | -------------- | -------------------------- |
| Event          | hasMany   | OriginalTicket | `eventId`                  |
| OriginalTicket | hasMany   | TicketForSale  | `originalTicketId`         |
| OriginalTicket | hasMany   | ActiveTicket   | `originalTicketId`         |
| TicketForSale  | belongsTo | OriginalTicket | `originalTicketId`         |
| TicketForSale  | belongsTo | User           | `fromUserId`               |
| Order          | hasMany   | OrderItem      | `orderId`                  |
| Order          | hasMany   | ActiveTicket   | `orderId`                  |
| User           | hasMany   | Order          | `deliveryEmail` -> `email` |
| User           | hasOne    | UserSetting    | `userId`                   |
| Payout         | belongsTo | User           | `vendorId`                 |

## Real code examples

### Non-default auth password field on user

```php
protected $fillable = [
    'email',
    'passwordHash',
    'name',
    'phone',
    'isVerified',
    // ...
];

public function getAuthPassword()
{
    return $this->passwordHash;
}
```

### Ticket reservation metadata on listing model

```php
protected $fillable = [
    'originalTicketId',
    'fromUserId',
    'eventId',
    'price',
    'isResell',
    'inBasket',
    'reservationStartedAt',
];

public function hasActiveReservation(): bool
{
    return $this->inBasket
        && $this->reservationStartedAt !== null
        && $this->reservationStartedAt->gt(now()->subMinutes(self::RESERVATION_MINUTES));
}
```

### User settings uses non-incrementing userId key

```php
public $primaryKey = 'userId';
public $incrementing = false;
protected $keyType = 'int';
```

## Important model notes

- `TicketForSale`, `ActiveTicket`, `TicketHistory`, and `VenueMap` disable Eloquent timestamps.
- `PasswordResetToken` uses email as primary key and stores only `created_at` token timestamp.
- `User::booted()` keeps `isVerified` and `email_verified_at` synchronized.
- Payout model currently defines `orderItemId`, but validate schema alignment before relying on it in new features.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-search-filtering-bulk.md](zz-docs/backend-search-filtering-bulk.md)
