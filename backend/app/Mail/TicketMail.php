<?php

namespace App\Mail;

use App\Models\ActiveTicket as Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use RuntimeException;

class TicketMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Queue-safe ticket IDs used to rehydrate models when job is processed.
     *
     * @var array<int>
     */
    public array $ticketIds = [];

    /**
     * Fallback context to rehydrate tickets when IDs are unavailable.
     */
    public ?int $orderId = null;

    /**
     * Internal model collection cache for current process only.
     */
    protected ?Collection $ticketModels = null;

    public function __construct(Collection $tickets)
    {
        $this->ticketModels = $tickets;
        $this->ticketIds = $tickets->pluck('id')->all();
        $this->orderId = $tickets->first()?->orderId;
    }

    public function build(): self
    {
        $tickets = $this->ticketModels;

        if (! $tickets instanceof Collection || $tickets->isEmpty()) {
            $query = Ticket::query()->with('originalTicket.event');

            if (! empty($this->ticketIds)) {
                $query->whereIn('id', $this->ticketIds);
            } elseif ($this->orderId !== null) {
                $query->where('orderId', $this->orderId);
            }

            $tickets = $query->get();
        }

        if ($tickets->isEmpty()) {
            throw new RuntimeException('TicketMail could not resolve any tickets to attach.');
        }

        $ticketsData = $tickets->map(fn($t) => $this->buildTicketViewData($t));
        $mail = $this->subject("Your Tickets - ReTicket")
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

    $sectionLabel = null;
    $rowLabel     = null;
    $seatLabel    = null;
    $hasSeat      = $originalTicket?->seatNumber !== null;

    if ($hasSeat) {
        if (!empty($originalTicket->section)) {
            $sectionLabel = 'Section: ' . $originalTicket->section;
        }
        if ($originalTicket->row !== null) {
            $rowLabel = 'Row: ' . $originalTicket->row;
        }
        $seatLabel = 'Seat: ' . $originalTicket->seatNumber;
    }

    return (object) [
        'event_name'    => $event?->name  ?? 'Event',
        'venue'         => $event?->venue ?? 'Venue TBA',
        'event_date'    => $eventTimestamp ? date('D, M j Y', $eventTimestamp) : 'TBA',
        'event_time'    => $eventTimestamp ? date('H:i', $eventTimestamp)      : 'TBA',
        'sectionLabel'  => $sectionLabel,
        'rowLabel'      => $rowLabel,
        'seatLabel'     => $seatLabel,
        'hasSeat'       => $hasSeat,
        'ticket_number' => (string) ($ticket->ticketListingId ?? $ticket->id),
    ];
}
}