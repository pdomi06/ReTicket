<?php

namespace App\Observers;

use App\Mail\TicketMail;
use App\Models\Order;
use Mail;

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
        if(!$order->wasChanged('paymentStatus')) {
            return;
        }
        if($order->paymentStatus !== 'authorized') {
            return;
        }
        if(!$order->deliveryEmail){
            return;
        }
        Mail::to($order->deliveryEmail)
    ->queue(new TicketMail($order->activeTickets));
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
