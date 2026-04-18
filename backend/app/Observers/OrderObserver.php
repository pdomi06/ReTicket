<?php

namespace App\Observers;

use App\Mail\TicketMail;
use App\Models\ActiveTicket;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if (! $order->wasChanged('paymentStatus')) {
            return;
        }

        if ($order->paymentStatus !== 'authorized') {
            return;
        }

        if (! $order->deliveryEmail) {
            return;
        }

        $activeTickets = ActiveTicket::where('orderId', $order->id)
            ->with('originalTicket.event')
            ->get();

        if ($activeTickets->isEmpty()) {
            return;
        }
        
        try {
            Mail::to($order->deliveryEmail)
                ->send(new TicketMail($activeTickets));
        } catch (Throwable $e) {
            Log::error('Failed to send ticket email after order authorization.', [
                'order_id' => $order->id,
                'delivery_email' => $order->deliveryEmail,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
    }
}
