# Backend payment processing

## Purpose

Document the live Stripe checkout implementation and how order/payment/finalization responsibilities are split across controllers.

## Current payment stack

- Stripe SDK: `stripe/stripe-php`
- Session creation endpoint: `POST /checkout` (plus alias `POST /orders/checkOut`)
- Session retrieval endpoint: `GET /checkout/session`
- Order lifecycle: `OrdersController`
- Finalization lifecycle: `TicketForSaleController::finalize`

## Key files

- [backend/app/Http/Controllers/StripeController.php](backend/app/Http/Controllers/StripeController.php)
- [backend/app/Http/Controllers/OrdersController.php](backend/app/Http/Controllers/OrdersController.php)
- [backend/app/Http/Controllers/TicketForSaleController.php](backend/app/Http/Controllers/TicketForSaleController.php)
- [backend/config/stripe.php](backend/config/stripe.php)

## Main payment sequence

1. Create order: `POST /orders`
2. Start Stripe checkout: `POST /checkout`
3. Read Stripe session on return: `GET /checkout/session?session_id=...`
4. Update order payment fields: `PATCH /orders/{order}`
5. Finalize ticket ownership/listings: `POST /ticketForSale/finalize`

## Endpoint behavior

| Method | Path                    | Access       | Result                                       |
| ------ | ----------------------- | ------------ | -------------------------------------------- |
| POST   | /orders                 | Public route | Creates order + order items + active tickets |
| POST   | /checkout               | Public       | Returns Stripe redirect URL                  |
| POST   | /orders/checkOut        | Public       | Alias to `StripeController::checkOut`        |
| GET    | /checkout/session       | Public       | Returns `session_id`, `payment_id`, `email`  |
| PATCH  | /orders/{order}         | Public route | Stores payment metadata/status               |
| POST   | /ticketForSale/finalize | Public       | Inserts history and removes live listings    |

## Real code examples

### Stripe session creation

```php
$checkoutSession = \Stripe\Checkout\Session::create([
    'mode' => 'payment',
    'line_items' => [[
        'price_data' => [
            'currency' => $currency,
            'unit_amount' => $unitAmount,
            'product_data' => [
                'name' => 'Custom Payment',
            ],
        ],
        'quantity' => 1,
    ]],
    'success_url' => $frontendUrl . '/checkout?state=successful&session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => $frontendUrl . '/checkout?state=failed',
]);
```

### Order staging creates active tickets before payment completion

```php
OrderItem::create([
    'orderId' => $order->id,
    'ticketListingId' => $ticketListingId,
    'price' => $ticketForSale->price,
]);

ActiveTicket::create([
    'ticketListingId' => $ticketListingId,
    'originalTicketId' => $ticketForSale->originalTicketId,
    'orderId' => $order->id,
]);
```

### Finalization removes live listing after history write

```php
DB::table('ticket_history')->insert([...]);

$deleted = DB::table('ticket_forsale')
    ->where('id', $ticketForSale->id)
    ->delete();
```

## Configuration

- `STRIPE_SECRET` and `STRIPE_KEY` are read by [backend/config/stripe.php](backend/config/stripe.php).
- `FRONTEND_URL` determines Stripe success/cancel redirect targets.
- `CASHIER_CURRENCY` (default `huf`) controls checkout currency.

## Risks and notes

- Checkout endpoints are public by current route/controller setup.
- No webhook-based reconciliation path is implemented in this flow.
- There is a legacy checkout endpoint (`/ticketForSale/checkOut`) with overlapping responsibilities.
- Finalization uses DB-level checks to avoid duplicate history rows per `ticketListingId`.

## Related docs

- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
