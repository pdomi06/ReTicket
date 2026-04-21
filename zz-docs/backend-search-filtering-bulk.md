# Backend search, filtering, and bulk operations

## Purpose

Document how search and bulk mutation endpoints currently work in backend code.

## Search endpoints

- `GET /events/search`
- `GET /venues/search`
- `GET /originalTickets/search`
- `GET /ticketForSale/search`

## Bulk endpoints

- `POST /originalTickets/bulk`
- `PUT /originalTickets/bulk`
- `POST /originalTickets/bulkStatusChange`

## Real code examples

### Grouped cursor pagination in event search

```php
$groupKeys = (clone $baseQuery)
    ->selectRaw("{$normalizedNameExpression} as group_key")
    ->when(
        !empty($cursor),
        fn (Builder $query) => $query->whereRaw("{$normalizedNameExpression} > ?", [$cursor])
    )
    ->groupBy(DB::raw($normalizedNameExpression))
    ->orderByRaw("{$normalizedNameExpression} asc")
    ->limit($limit + 1)
    ->pluck('group_key');
```

### Timezone-aware date filtering

```php
$userTimezone = $filters['timezone'] ?? '+00:00';
$date = Carbon::createFromFormat('Y-m-d', $filters['eventDate'], $userTimezone);

$startOfDayTimestamp = $date->copy()->startOfDay()->timestamp;
$endOfDayTimestamp = $date->copy()->endOfDay()->timestamp;

$query->whereBetween('eventDate', [$startOfDayTimestamp, $endOfDayTimestamp]);
```

### Bulk status-change listing synchronization

```php
if ($newStatus === 'active' && $oldStatus !== 'active') {
    // create missing ticket_forsale rows
}

if ($oldStatus === 'active' && $newStatus !== 'active') {
    TicketForSale::where('eventId', $eventId)->delete();
}
```

### Destructive bulk replace behavior

```php
TicketForSale::where('eventId', $eventId)->delete();
OriginalTicket::where('eventId', $eventId)->delete();
OriginalTicket::insert($originalTickets);
```

## Validation contracts

Search validators:

- [backend/app/Http/Requests/SearchEventsRequest.php](backend/app/Http/Requests/SearchEventsRequest.php)
- [backend/app/Http/Requests/SearchVenueMapRequest.php](backend/app/Http/Requests/SearchVenueMapRequest.php)
- [backend/app/Http/Requests/SearchOriginalTicketsRequest.php](backend/app/Http/Requests/SearchOriginalTicketsRequest.php)
- [backend/app/Http/Requests/SearchTicketForSaleRequest.php](backend/app/Http/Requests/SearchTicketForSaleRequest.php)

Bulk validator:

- [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php)

## Practical notes

- Event search returns grouped occurrences plus cursor metadata.
- Other search endpoints currently return non-paginated arrays.
- `bulk` and `bulk update` generate `ticketPdfUrl` as empty string placeholders.
- Bulk update is destructive; use carefully in administrative tooling.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-data-models.md](zz-docs/backend-data-models.md)
