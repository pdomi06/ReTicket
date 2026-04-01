# Backend search, filtering, and bulk operations

## Purpose

Document current search/filter and bulk mutation behavior exactly as implemented in backend controllers, request validation classes, and model scopes.

## Overview

Search is exposed through dedicated endpoints per resource type, while bulk writes are currently concentrated in original ticket management.

- Search endpoints are explicitly routed in [backend/routes/api.php](backend/routes/api.php#L24).
- Filter contracts are validated by Form Requests before query building.
- Event search/list endpoints are paginated.
- Bulk operations can trigger destructive rewrites and status-driven side effects.

## Key files and locations

- Route declarations: [backend/routes/api.php](backend/routes/api.php#L24)
- Search controllers:
  - [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L37)
  - [backend/app/Http/Controllers/VenueMapController.php](backend/app/Http/Controllers/VenueMapController.php#L28)
  - [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L32)
  - [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L31)
- Search request validators:
  - [backend/app/Http/Requests/SearchEventsRequest.php](backend/app/Http/Requests/SearchEventsRequest.php#L20)
  - [backend/app/Http/Requests/SearchVenueMapRequest.php](backend/app/Http/Requests/SearchVenueMapRequest.php#L20)
  - [backend/app/Http/Requests/SearchOriginalTicketsRequest.php](backend/app/Http/Requests/SearchOriginalTicketsRequest.php#L20)
  - [backend/app/Http/Requests/SearchTicketForSaleRequest.php](backend/app/Http/Requests/SearchTicketForSaleRequest.php#L20)
- Bulk endpoints and logic:
  - [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L106)
  - [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php#L24)

## Patterns and conventions

### Search endpoints

- `GET /events/search`
- `GET /venues/search`
- `GET /originalTickets/search`
- `GET /ticketForSale/search`

All four paths are registered in [backend/routes/api.php](backend/routes/api.php#L24).

### Filter contracts (validated input)

#### Events (`SearchEventsRequest`)

Supported query keys:

- `name`
- `venue`
- `city`
- `country`
- `eventDate` (`Y-m-d`)
- `timezone` (extra validation via `after()`)
- `maxPrice`
- `category` (`cultural|music|sport`)
- `page`

Reference: [backend/app/Http/Requests/SearchEventsRequest.php](backend/app/Http/Requests/SearchEventsRequest.php#L20)

#### Venue maps (`SearchVenueMapRequest`)

Supported query keys:

- `venue`
- `section`
- `rows`
- `cols`
- `rate`

Reference: [backend/app/Http/Requests/SearchVenueMapRequest.php](backend/app/Http/Requests/SearchVenueMapRequest.php#L20)

#### Original tickets (`SearchOriginalTicketsRequest`)

Supported query keys:

- `eventId`
- `section`
- `row`
- `seatNumber`
- `price`
- `status`
- `ticketPdfUrl`

Reference: [backend/app/Http/Requests/SearchOriginalTicketsRequest.php](backend/app/Http/Requests/SearchOriginalTicketsRequest.php#L20)

#### Ticket for sale (`SearchTicketForSaleRequest`)

Supported query keys:

- `originalTicketId`
- `fromUserId`
- `eventId`
- `price`
- `inBasket`

Reference: [backend/app/Http/Requests/SearchTicketForSaleRequest.php](backend/app/Http/Requests/SearchTicketForSaleRequest.php#L20)

### Query behavior

- Events search performs manual conditional query building and paginates (`paginate(20)`) in [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L81).
- Events index also paginates (`paginate(20)`) and includes `firstTicketStatus` derived from loaded ticket relation in [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L23).
- Venue maps search uses model scope `VenueMap::search(...)` in [backend/app/Http/Controllers/VenueMapController.php](backend/app/Http/Controllers/VenueMapController.php#L32).
- Original tickets search uses manual conditional clauses (not the model scope) in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L36).
- Ticket-for-sale search uses manual conditional clauses (not the model scope) in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L35).

### Bulk operation endpoints

Original tickets expose three bulk actions:

- `POST /originalTickets/bulk` -> seat grid expansion insert in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L106)
- `PUT /originalTickets/bulk` -> delete existing event tickets/listings then reinsert in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L135)
- `POST /originalTickets/bulkStatusChange` -> mass status update + for-sale synchronization in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L168)

Bulk request shape for `bulk`/`bulk update` is validated by [backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php](backend/app/Http/Requests/BulkStoreOriginalTicketsRequest.php#L24).

## Examples (real code)

### Example 1: Timezone-aware event-date filtering

- `eventDate` and `timezone` are validated in [backend/app/Http/Requests/SearchEventsRequest.php](backend/app/Http/Requests/SearchEventsRequest.php#L26).
- Controller converts date to day-range timestamps using timezone before `whereBetween` in [backend/app/Http/Controllers/EventsController.php](backend/app/Http/Controllers/EventsController.php#L64).

### Example 2: Ticket for sale filtering

- Filter keys applied conditionally in [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php#L35).

### Example 3: Bulk update destructive rewrite

- `bulkUpdate` deletes existing `ticket_forsale` and `original_tickets` rows for the event before re-inserting generated seats in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L141).

### Example 4: Status-change automation side effects

- Changing event ticket status to `active` backfills sale listings; changing away from `active` deletes listings in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L184).

## Gotchas and known issues

- Not all controllers use model `scopeSearch` methods even when scopes exist; search logic is partly duplicated in controllers.
- Events endpoints return paginated payload shape, while the other search endpoints return full arrays without pagination metadata.
- `bulkUpdate` is destructive for event ticket/listing state before reinsertion.
- `bulkStore` and `bulkUpdate` set `ticketPdfUrl` to an empty string in generated tickets; this differs from single-ticket create validation requiring a URL.
- Search and list response envelopes are inconsistent across resources.

## Related docs

- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-data-models.md](zz-docs/backend-data-models.md)
- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
