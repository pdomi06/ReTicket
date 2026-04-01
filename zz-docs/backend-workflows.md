# Backend Workflows

## 1. Event Creation to Ticket Inventory

1. Organizer creates event via `/events`.
2. Organizer creates original tickets via `/originalTickets` or `/originalTickets/bulk`.
3. Organizer can modify ticket statuses with `/originalTickets/bulkStatusChange`.
4. Event and tickets become discoverable through search endpoints.

Authorization anchors:

- Organizer-level access is enforced through policy checks and route middleware.
- Admin can bypass in most policy `before()` checks.

## 2. Ticket Resale Flow

1. Vendor creates sale listings under `/ticketForSale`.
2. Buyers/guests browse listings with `/ticketForSale/search`.
3. Basket reservation actions use:
   - `/ticketForSale/addToBasket/{id}`
   - `/ticketForSale/removeFromBasket/{id}`
   - `/ticketForSale/basketChange/{id}`
4. Listing ownership stays tied to `fromUserId`.

Authorization anchors:

- Vendors can update/delete only own sale listings.
- Basket modification policy denies seller from modifying own listing basket path.

## 3. Order to Payout Flow

1. Buyer creates order through `/orders`.
2. Related order items are created and linked with `/orderItems`.
3. Seller payout entries are read through `/my/payouts`.
4. Admin-level payout updates run through `/payouts/{payout}`.

Ownership anchors:

- Order access can be constrained by `buyerEmail == user.email`.
- Payout access can be constrained by `vendorId == user.id`.

## 4. History and Audit

Ticket transfer or sale history is written and read via `/ticketHistory` endpoints.

- `/ticketHistory/my/history` uses Sanctum middleware.
- Use history records to build user-level ticket movement audit views.

## 5. Verification and Password Recovery

Email verification:

1. Request link via `/email/verify/send`.
2. Validate token via `/email/verify`.

Password reset:

1. Request reset via `/password/forgot`.
2. Apply reset via `/password/reset`.

## 6. Workflow Risk Notes

- Basket race conditions are possible in concurrent purchase attempts.
- Email-based ownership (`buyerEmail`) requires careful account email integrity.
- Route naming drift between frontend and backend can silently break workflows.
