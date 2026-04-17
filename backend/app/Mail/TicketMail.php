<?php

namespace App\Mail;

use App\Models\ActiveTicket as Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected Ticket $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function build(): self
    {
        $ticketData = $this->buildTicketViewData();
        $pdf = Pdf::loadView('tickets.ticket', ['ticket' => $ticketData]);

        return $this->subject("Your Ticket for {$ticketData->event_name} - ReTicket")
            ->view('emails.ticket', ['ticket' => $ticketData])
            ->attachData(
                $pdf->output(),
                'ticket-' . $ticketData->ticket_number . '.pdf',
                ['mime' => 'application/pdf']
            );
    }

    private function buildTicketViewData(): object
    {
        $originalTicket = $this->ticket->originalTicket;
        $event          = $originalTicket?->event;

        $eventTimestamp = is_numeric($event?->eventDate) ? (int) $event->eventDate : null;

        $seat = null;
        if ($originalTicket?->seatNumber !== null) {
            $seatParts = [];
            if (!empty($originalTicket->section)) {
                $seatParts[] = 'Section ' . $originalTicket->section;
            }
            if ($originalTicket->row !== null) {
                $seatParts[] = 'Row ' . $originalTicket->row;
            }
            $seatParts[] = 'Seat ' . $originalTicket->seatNumber;
            $seat = implode(' | ', $seatParts);
        }

        return (object) [
            'event_name'  => $event?->name    ?? 'Event',
            'venue'       => $event?->venue   ?? 'Venue TBA',
            'event_date'  => $eventTimestamp  ? date('D, M j Y', $eventTimestamp) : 'TBA',
            'event_time'  => $eventTimestamp  ? date('H:i', $eventTimestamp)      : 'TBA',
            'seat'        => $seat,
            'ticket_number' => (string) ($this->ticket->ticketListingId ?? $this->ticket->id),
        ];
    }
}