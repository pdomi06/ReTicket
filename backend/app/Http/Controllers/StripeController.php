<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class StripeController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function checkOut(Request $request)
    {
        \Stripe\Stripe::setApiKey(config('stripe.sk'));
        $frontendUrl = rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $total = (float) $request->input('total', 5000);
        $currency = strtolower((string) env('CASHIER_CURRENCY', 'huf'));
        $unitAmount = (int) round($total * 100);

        $order = Order::where('id', $request->input('orderId'))->first();
        if (! $order) {
            return response()->json([
                'message' => 'Order not found.',
            ], 404);
        }

        $order->status = 'processing';
        $order->paymentStatus = "pending";
        $order->save();

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
            'automatic_tax' => [
                'enabled' => true,
            ],
            'invoice_creation' => [
                'enabled' => true,
             ],
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'url' => $checkoutSession->url,
            ], 200);
        }

        return redirect()->away($checkoutSession->url);
    }

    public function checkoutSession(Request $request)
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string'],
        ]);

        \Stripe\Stripe::setApiKey(config('stripe.sk'));

        $checkoutSession = \Stripe\Checkout\Session::retrieve($validated['session_id']);

        $customerEmail = $checkoutSession->customer_details->email
            ?? $checkoutSession->customer_email
            ?? null;

        return response()->json([
            'session_id' => $checkoutSession->id,
            'payment_id' => $checkoutSession->payment_intent,
            'email' => $customerEmail,
        ], 200);
    }

    public function success()
    {
        return view('index');
    }
}
