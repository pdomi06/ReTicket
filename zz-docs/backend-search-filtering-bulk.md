# Backend Search, Filtering, and Bulk Operations

## Search Endpoints

Key searchable API paths:

- `/events/search`
- `/venues/search`
- `/originalTickets/search`
- `/ticketForSale/search`

## Model Scope Patterns

### Event filtering

`Event::search($filters)` supports:

- `name` (name like)
- `venue` (venue like)
- `city` (city like)
- `country` (country like)
- `eventDate` (exact date)
- `category` (exact category)
- `maxPrice` (basePrice upper bound)

Controller-level event list endpoints (`GET /events` and `GET /events/search`) return newest-first ordering by `createdAt`.

### Original ticket filtering

`OriginalTicket::search($filters)` supports:

- `eventId`
- `section`
- `row`
- `seatNumber`
- `price`
- `status`
- `ticketPdfUrl`

### Ticket for sale filtering

`TicketForSale::search($filters)` supports:

- `originalTicketId`
- `fromUserId`
- `eventId`
- `price`
- `inBasket`

## Bulk Operations

Original tickets include explicit bulk endpoints:

- `POST /originalTickets/bulk`
- `PUT /originalTickets/bulk`
- `POST /originalTickets/bulkStatusChange`

## Bulk Safety Recommendations

1. Validate seat uniqueness before bulk insert/update.
2. Keep idempotency in mind for retry behavior.
3. Log batch-level failures with actionable detail.
4. Re-query dashboard/search views after batch changes to prevent stale UI.

## Frontend Integration Note

Event seat selection should always apply event-scoped filtering (`eventId`) before rendering availability maps.

This protects against mixed-event or stale ticket datasets when users navigate quickly between events.
