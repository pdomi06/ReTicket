<?php

namespace App\Http\Controllers;

use App\Mail\TicketMail;
use App\Models\ActiveTicket as Ticket;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class TicketController extends Controller
{
    // Example route: POST /tickets/{ticket}/send
    public function send(Ticket $ticket): JsonResponse
    {
        $recipient = $ticket->order?->deliveryEmail ?? request()->user()?->email;

        if (!$recipient) {
            return response()->json([
                'message' => 'No delivery email found for this ticket.',
            ], 422);
        }

        Mail::to($recipient)->send(new TicketMail(Collection::make([$ticket])));

        return response()->json([
            'message' => 'Ticket email sent successfully.',
            'ticket' => $ticket->id,
            'recipient' => $recipient,
        ], 202);
    }
}