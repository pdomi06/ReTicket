# Project overview

## Purpose

High-level map of the ReTicket platform and where core logic lives.

## What ReTicket does

ReTicket is a ticket resale platform designed to reduce fraud by controlling listing ownership, checkout, and ticket state transitions.

## Repository structure

- `backend/`: Laravel API (auth, ticketing, checkout, policies, scheduler)
- `frontend/`: React + TypeScript SPA (routing, auth context, cart flow, dashboard)
- `zz-docs/`: implementation-aligned documentation chunks

## Core domain entities

- Event
- OriginalTicket
- TicketForSale
- ActiveTicket
- TicketHistory
- Order / OrderItem
- Payout
- Review
- User / UserSetting

## Real code examples

### Backend route registration shape

```php
Route::apiResource('events', EventsController::class);
Route::apiResource('ticketForSale', TicketForSaleController::class);
Route::post('checkout', [StripeController::class, 'checkOut']);
```

### Frontend route tree uses lazy modules + guarded routes

```tsx
{ path: "/profile", element: <RequireAuth><Profile /></RequireAuth> },
{
  path: "/dashboard",
  element: <RequireAuth><Dashboard /></RequireAuth>,
  children: [
    { index: true, element: <DashboardMyTickets /> },
    { path: "orders", element: <DashboardOrders /> },
  ],
},
```

## End-to-end flow summary

1. User discovers events from `/events/search`.
2. Seats are reserved through basket endpoints in `ticketForSale`.
3. Checkout creates order and Stripe session.
4. Finalization moves sold listings into ticket history and active ownership.
5. Organizer workflows include ticket validation and event statistics.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/permissions.md](zz-docs/permissions.md)
