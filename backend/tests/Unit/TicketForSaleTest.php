<?php

namespace Tests\Unit;

use App\Models\Event;
use App\Models\OriginalTicket;
use App\Models\TicketForSale;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketForSaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_has_active_reservation_returns_true_when_in_basket_and_recent(): void
    {
        $ticket = new TicketForSale([
            'inBasket' => true,
            'reservationStartedAt' => now()->subMinutes(15),
        ]);

        $this->assertTrue($ticket->hasActiveReservation());
    }

    public function test_has_active_reservation_returns_false_when_not_in_basket(): void
    {
        $ticket = new TicketForSale([
            'inBasket' => false,
            'reservationStartedAt' => now()->subMinutes(5),
        ]);

        $this->assertFalse($ticket->hasActiveReservation());
    }

    public function test_has_active_reservation_returns_false_when_reservation_expired(): void
    {
        $ticket = new TicketForSale([
            'inBasket' => true,
            'reservationStartedAt' => now()->subMinutes(31),
        ]);

        $this->assertFalse($ticket->hasActiveReservation());
    }

    public function test_has_active_reservation_returns_false_when_no_reservation_started_at(): void
    {
        $ticket = new TicketForSale([
            'inBasket' => true,
            'reservationStartedAt' => null,
        ]);

        $this->assertFalse($ticket->hasActiveReservation());
    }

    public function test_has_active_reservation_returns_false_at_exact_expiry_boundary(): void
    {
        $ticket = new TicketForSale([
            'inBasket' => true,
            'reservationStartedAt' => now()->subMinutes(TicketForSale::RESERVATION_MINUTES),
        ]);

        $this->assertFalse($ticket->hasActiveReservation());
    }

    private function createTicket(array $attributes = []): TicketForSale
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $event = Event::factory()->create(['createdBy' => $organizer->id]);
        $originalTicket = OriginalTicket::factory()->create(['eventId' => $event->id]);

        return TicketForSale::factory()->create(array_merge([
            'originalTicketId' => $originalTicket->id,
            'eventId' => $event->id,
            'fromUserId' => $organizer->id,
        ], $attributes));
    }

    public function test_scope_expired_returns_ticket_in_basket_with_null_reservation(): void
    {
        $this->createTicket(['inBasket' => true, 'reservationStartedAt' => null]);

        $expired = TicketForSale::expired()->get();
        $this->assertCount(1, $expired);
    }

    public function test_scope_expired_returns_ticket_with_expired_reservation(): void
    {
        $this->createTicket([
            'inBasket' => true,
            'reservationStartedAt' => now()->subMinutes(31),
        ]);

        $expired = TicketForSale::expired()->get();
        $this->assertCount(1, $expired);
    }

    public function test_scope_expired_excludes_active_reservation(): void
    {
        $this->createTicket([
            'inBasket' => true,
            'reservationStartedAt' => now()->subMinutes(15),
        ]);

        $expired = TicketForSale::expired()->get();
        $this->assertCount(0, $expired);
    }

    public function test_scope_expired_excludes_tickets_not_in_basket(): void
    {
        $this->createTicket(['inBasket' => false, 'reservationStartedAt' => null]);

        $expired = TicketForSale::expired()->get();
        $this->assertCount(0, $expired);
    }
}
