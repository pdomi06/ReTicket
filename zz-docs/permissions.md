# ReTicket Authorization and Access Matrix

This document reflects authorization behavior currently implemented in controllers, routes, and policies.

## Current Enforcement Model

1. Route exposure is defined in `backend/routes/api.php`.
2. Authentication is enforced in controllers via `auth:sanctum` middleware.
3. Role and ownership policy enforcement is currently incomplete for some resources because key policy files are still stubs.

## Public vs Authenticated Endpoints

| Area                     | Public Access                                                                                                                | Auth Required                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Auth                     | `POST /login`, `POST /register`                                                                                              | `POST /logout`                                |
| Events                   | `GET /events`, `GET /events/{event}`, `GET /events/search`                                                                   | `POST/PUT/DELETE /events...`                  |
| Venue Maps               | `GET /venues`, `GET /venues/search`                                                                                          | write operations under `/venues` and `/venue` |
| Original Tickets         | `GET /originalTickets`, `GET /originalTickets/{id}`, `GET /originalTickets/search`, `GET /originalTickets/forSale/{eventId}` | dashboard and write operations                |
| Ticket For Sale          | `GET /ticketForSale`, `GET /ticketForSale/{id}`, `GET /ticketForSale/search`, `POST /ticketForSale/checkOut`                 | basket operations and write operations        |
| Reviews                  | `GET /reviews`                                                                                                               | create/update/delete reviews                  |
| Most remaining resources | none                                                                                                                         | full resource access requires `auth:sanctum`  |

## Policy Status

Policy files exist under `backend/app/Policies/`, but at least the following currently return `false` for all actions:

- `EventsPolicy`
- `VenueMapPolicy`

Because of this, do not assume role-based allow rules in those resources are active yet.

## Ownership Keys Present in Data Model

These keys exist and can be used for ownership checks where implemented:

- Event creator: `events.createdBy`
- Ticket listing owner: `ticket_for_sale.fromUserId`
- Buyer linkage: `orders.buyerEmail` (matched to `users.email`)
- Payout owner: `payouts.vendorId`

## Role Notes

The codebase and docs reference roles such as `admin`, `organizer`, `vendor`, and `guest`, but role enforcement should be treated as partial until policy methods are implemented with explicit allow/deny logic.

## Practical Guidance

When changing authorization behavior:

1. Update controller middleware exceptions first.
2. Implement or update relevant policy methods.
3. Keep this file and `backend/routes/api.php` in sync.
