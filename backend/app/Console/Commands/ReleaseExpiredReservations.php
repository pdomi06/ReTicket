<?php

namespace App\Console\Commands;

use App\Models\TicketForSale;
use Illuminate\Console\Command;

class ReleaseExpiredReservations extends Command
{
    protected $signature = 'tickets:release-expired';

    protected $description = 'Release ticket_forsale reservations that have passed their expiry time';

    public function handle(): int
    {
        $count = TicketForSale::query()->expired()->update([
            'inBasket' => false,
            'reservationStartedAt' => null,
        ]);

        $this->info("Released {$count} expired reservations.");

        return self::SUCCESS;
    }
}
