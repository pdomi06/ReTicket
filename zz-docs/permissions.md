# ReTicket Permissions & Role Matrix

This document outlines what each role and guests can access and perform in the ReTicket platform.

## Roles Overview

| Role          | Type            | Description                                      |
| ------------- | --------------- | ------------------------------------------------ |
| **Admin**     | System          | Full platform control with override capabilities |
| **Organizer** | User            | Creates and manages events and their tickets     |
| **Vendor**    | Default         | Manages tickets for sale and payouts             |
| **Guest**     | Unauthenticated | Public access with view-only capabilities        |

---

## 1. Admin Role

**Full platform access.** Admin bypasses most authorization checks via a `before()` hook in policies.

### Admin Capabilities

| Resource               | Actions                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **Events**             | View all, create, update any, delete any, restore                                               |
| **Original Tickets**   | View all, create, update any, delete any, manage ticket status                                  |
| **Active Tickets**     | View all, create, update any, delete any, create for event                                      |
| **Tickets for Sale**   | View all, create, update any                                                                    |
| **Orders**             | View all, create, update any, delete any, restore                                               |
| **Order Items**        | View all, view any item, create                                                                 |
| **Users**              | View all users, create, update any (except delete self), delete any user (except self), restore |
| **User Settings**      | View any user's settings, create settings                                                       |
| **Venue Maps**         | View all, create, update any, delete any                                                        |
| **Payouts**            | View all, update any payout                                                                     |
| **Ticket History**     | View all, create history entries                                                                |
| **Reviews**            | View all, update any review                                                                     |
| **Password Resets**    | Bypass all restrictions                                                                         |
| **Email Verification** | Bypass all restrictions                                                                         |

---

## 2. Organizer Role

**Event creators and managers.** Organizers can only manage resources they own or are associated with.

### Organizer Capabilities

| Resource             | Actions                                                        | Restrictions                                                   |
| -------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Events**           | View all, create, update own, delete own                       | Must own the event (`event->organizer_id === user->id`)        |
| **Original Tickets** | View all, create, update own, delete own, manage status        | Must own the associated event                                  |
| **Active Tickets**   | View all, create, update own, delete own, create for own event | Must own the event via original ticket                         |
| **Venue Maps**       | View all, create, update own, delete own                       | Must own the venue map (`venueMap->organizer_id === user->id`) |
| **Orders**           | View public list only                                          | Can view orders if they are the buyer (via email)              |
| **Reviews**          | View all public reviews, create reviews                        | Can only see visible reviews                                   |
| **Tickets for Sale** | View all, cannot directly manage                               | Can buy via orders                                             |

---

## 3. Vendor Role (Default)

**Ticket sellers and marketplace users.** Vendors manage items they own.

### Vendor Capabilities

| Resource             | Actions                                                                         | Restrictions                                                   |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Tickets for Sale** | View all, create tickets, update own tickets, delete own tickets, modify basket | Must own the ticket (`ticketForSale->fromUserId === user->id`) |
| **Payouts**          | View own payouts                                                                | Must match seller ID (`payout->vendorId === user->id`)         |
| **Orders**           | View own orders only                                                            | By email match (`order->buyerEmail === user->email`)           |
| **Order Items**      | View own order items                                                            | By email match                                                 |
| **User Settings**    | View own settings, update own settings                                          | Own user ID only                                               |
| **Reviews**          | View all public, create reviews                                                 | Can only create, cannot update/delete                          |
| **Events**           | View all events                                                                 | View-only access                                               |

---

## 4. Guest Role (Unauthenticated Users)

**Public access.** Guests can only view certain public resources.

### Guest Capabilities

| Resource               | Actions                                         |
| ---------------------- | ----------------------------------------------- |
| **Events**             | View all, view details                          |
| **Original Tickets**   | View all, view details                          |
| **Active Tickets**     | View all, view details                          |
| **Tickets for Sale**   | View all, view details                          |
| **Venue Maps**         | View all, view details                          |
| **Reviews**            | View only if `isVisible === true`               |
| **Password Resets**    | Request password reset link, verify reset token |
| **Email Verification** | Request verification link, verify token         |

### Guest Restrictions

❌ Cannot create accounts (must sign up)  
❌ Cannot create/update/delete any resources  
❌ Cannot view hidden reviews  
❌ Cannot access orders or user settings  
❌ Cannot access admin panels  
❌ Cannot view payouts or ticket history

---

## Key Observations

### Protected by Ownership

- **Organizers** are limited by `event->organizer_id` or `venueMap->organizer_id`
- **Vendors** are limited by `ticketForSale->fromUserId`
- **Buyers** are identified by `order->buyerEmail` (not user ID!)
- **Users** can only access their own settings and delete their own account

### Admin Overrides

- Admin uses a `before()` hook to bypass most checks
- Admin cannot forcefully delete password resets or email verifications however
- Admin can restore most deleted resources

### Guest/Public Access

- No email or authentication required
- Limited to viewing public resources only
- Can request password resets and email verification

### Ticket History

- Restricted to parties involved (`fromUserId` or `toUserId`)
- Only admins can view all history

### Payouts

- Only vendors can view their own
- Only admins can manage all payouts

---

## Authorization Flow Example

When a user tries to **update an event**:

1. Check if Admin → Allow all updates
2. Check if Organizer → Allow only if `event->organizer_id === user->id`
3. Check if Vendor/Guest → Deny

When a user tries to **view order items**:

1. Check if Admin → Allow all
2. Check if Vendor → Allow only if `order->buyerEmail === user->email`
3. Check if Guest → Deny

---

## Notes

- **Buyer Email Matching**: Orders and order items use email matching rather than user ID relationships, allowing purchased items to be accessed by the email that made the purchase (not necessarily the logged-in user ID)
- **Ticket Status Changes**: Organizers and admins can modify ticket statuses (pending/active/archived) for their tickets
- **Review Visibility**: Reviews have a `isVisible` flag; guests can only see visible reviews
