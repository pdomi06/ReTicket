<?php

namespace App\Mail;

use App\Models\ActiveTicket as Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Database\Eloquent\Collection;

class TicketMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Collection $tickets;

    public function __construct(Collection $tickets)
    {
        $this->tickets = $tickets;
    }

    public function build(): self
    {
        $ticketsData = $this->tickets->map(fn($t) => $this->buildTicketViewData($t));
        $mail = $this->subject("Your Tickets – ReTicket")
            ->view('emails.ticket', ['tickets' => $ticketsData]);

        foreach ($ticketsData as $ticketData) {
            $pdf = Pdf::loadView('tickets.ticket', ['ticket' => $ticketData]);
            $mail->attachData(
                $pdf->output(),
                'ticket-' . $ticketData->ticket_number . '.pdf',
                ['mime' => 'application/pdf']
            );
        }

        return $mail;
    }

    private function buildTicketViewData(Ticket $ticket): object
    {
        $originalTicket = $ticket->originalTicket;
        $event          = $originalTicket?->event;
        $eventTimestamp = is_numeric($event?->eventDate) ? (int) $event->eventDate : null;

        $seat = null;
        if ($originalTicket?->seatNumber !== null) {
            $seatParts = [];
            if (!empty($originalTicket->section)) $seatParts[] = 'Section ' . $originalTicket->section;
            if ($originalTicket->row !== null)     $seatParts[] = 'Row ' . $originalTicket->row;
            $seatParts[] = 'Seat ' . $originalTicket->seatNumber;
            $seat = implode(' | ', $seatParts);
        }

        return (object) [
            'event_name'    => $event?->name  ?? 'Event',
            'venue'         => $event?->venue ?? 'Venue TBA',
            'event_date'    => $eventTimestamp ? date('D, M j Y', $eventTimestamp) : 'TBA',
            'event_time'    => $eventTimestamp ? date('H:i', $eventTimestamp)      : 'TBA',
            'seat'          => $seat,
            'ticket_number' => (string) ($ticket->ticketListingId ?? $ticket->id),
        ];
    }
}