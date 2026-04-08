<?php

namespace Database\Factories;

use App\Models\ActiveTicket;
use App\Models\OriginalTicket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketHistory>
 */
class TicketHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'originalTicketId' => OriginalTicket::inRandomOrder()->first()->id ?? OriginalTicket::factory(),
            'ticketListingId' => ActiveTicket::inRandomOrder()->value('ticketListingId')
                ?? ActiveTicket::factory()->create()->ticketListingId,
            'fromUserId' => User::inRandomOrder()->first()->id ?? User::factory(),
            'toUser' => User::inRandomOrder()->value('email') ?? User::factory()->create()->email,
            'price' => fake()->randomFloat(2, 10, 500),
            'platformFee' => fake()->randomFloat(2, 1, 50),
        ];
    }
}
