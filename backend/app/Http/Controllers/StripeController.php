<?php

namespace App\Http\Controllers;

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
        $frontendUrl = rtrim(config('services.frontend.url', env('FRONTEND_URL', 'http://localhost:5173')), '/');
        $total = (float) $request->input('total', 5000);
        $currency = strtolower((string) env('CASHIER_CURRENCY', 'huf'));
        $unitAmount = $currency === 'huf'
            ? (int) round($total * 100)
            : (int) round($total);

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
            'success_url' => $frontendUrl . '/cart?success=true&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontendUrl . '/cart?canceled=true',
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

        return response()->json([
            'session_id' => $checkoutSession->id,
            'payment_id' => $checkoutSession->payment_intent,
            'email' => $checkoutSession->customer_details->email ?? null,
        ], 200);
    }

    public function success()
    {
        return view('index');
    }
}
