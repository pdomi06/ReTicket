# Backend workflows

## Purpose

Describe end-to-end backend workflows as currently implemented, including side effects and cross-controller handoffs.

## Workflow map

### 1. Event creation and seat inventory generation

1. Organizer/admin creates event via `POST /events`.
2. Seats are generated with `POST /originalTickets/bulk`.
3. Initial status is `pre-release`.
4. Activation is done with `POST /originalTickets/bulkStatusChange`.

### 2. Ticket status changes and listing synchronization

- `bulkStatusChange` updates every ticket status for an event.
- If status transitions to `active`, missing `ticket_forsale` rows are created.
- If status transitions away from `active`, `ticket_forsale` rows for that event are deleted.

### 3. Basket reservation and concurrency

- Public endpoint `POST /ticketForSale/addToBasket/{id}` uses transaction + row lock.
- If reservation is already active, API returns `409`.
- Removal endpoint clears `inBasket` and `reservationStartedAt`.

### 4. Checkout pipeline (current main path)

1. `POST /orders` creates order + order_items + active_tickets.
2. `POST /checkout` creates Stripe Checkout session URL.
3. Frontend returns with `session_id` and calls `GET /checkout/session`.
4. Frontend updates order payment fields (`PATCH /orders/{order}`).
5. `POST /ticketForSale/finalize` writes ticket history and deletes live listings.

### 5. Legacy checkout pipeline (still present)

- `POST /ticketForSale/checkOut` writes to `ticket_history` and `active_tickets` directly, then deletes listings.
- This overlaps responsibilities with the newer order + finalize flow.

### 6. Active-ticket validation and resale

- Organizer validates ticket with `POST /activeTickets/validate`.
- Ticket lookup path for scanners: `POST /activeTickets/checkTicket`.
- Resale path: `POST /activeTickets/resell` (creates resale listing and deletes active ticket).

### 7. Account recovery and email change

- Password reset flow: `POST /password/forgot` -> `POST /password/reset`.
- Email verification flow: signed `GET /email/verify/{id}/{hash}` plus resend endpoint.
- Email change flow: `POST /user/email/change` -> signed `GET /user/email/confirm/{id}`.

### 8. Reservation cleanup automation

- Scheduler runs `tickets:release-expired` every 10 minutes.
- Command clears expired basket reservations (`inBasket=false`, `reservationStartedAt=null`).

## Real code examples

### Status-change listing automation

```php
if ($newStatus === 'active' && $oldStatus !== 'active') {
    // create missing for-sale rows
}

if ($oldStatus === 'active' && $newStatus !== 'active') {
    TicketForSale::where('eventId', $eventId)->delete();
}
```

### Checkout finalization idempotency guard

```php
$alreadyFinalized = DB::table('ticket_history')
    ->where('ticketListingId', $ticket->ticketListingId)
    ->exists();

if (! $alreadyFinalized) {
    DB::table('ticket_history')->insert([...]);
}
```

### Scheduler wiring for reservation cleanup

```php
Schedule::command('tickets:release-expired')
    ->everyTenMinutes()
    ->withoutOverlapping();
```

### Cleanup command behavior

```php
$count = TicketForSale::query()->expired()->update([
    'inBasket' => false,
    'reservationStartedAt' => null,
]);
```

## Workflow risks and notes

- Checkout still has overlapping modern and legacy paths.
- Basket endpoints are intentionally public and conflict-driven (`409`) rather than ownership-gated.
- `my/payouts` is declared twice in routes; verify effective registration order in your route cache/list output.
- Finalization depends on active tickets created earlier in the order pipeline.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-payment-processing.md](zz-docs/backend-payment-processing.md)
- [zz-docs/backend-account-recovery.md](zz-docs/backend-account-recovery.md)
- [zz-docs/backend-search-filtering-bulk.md](zz-docs/backend-search-filtering-bulk.md)
