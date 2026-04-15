<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\TicketForSale;
use Illuminate\Console\Command;

class ReleaseExpiredReservations extends Command
{
    protected $signature = 'reservations:release-expired';
    protected $description = 'Release all ticket_forsale rows whose reservation has expired.';

    public function handle(): int
    {
        $released = TicketForSale::where('inBasket', true)
            ->where(function ($q) {
                $q->where('reservation_expires_at', '<=', now())
                    ->orWhereNull('reservation_expires_at');
            })
            ->update([
                'inBasket' => false,
                'basket_token' => null,
                'reservation_started_at' => null,
                'reservation_expires_at' => null,
            ]);

        $this->info("Released {$released} expired reservation(s).");

        return Command::SUCCESS;
    }
}
