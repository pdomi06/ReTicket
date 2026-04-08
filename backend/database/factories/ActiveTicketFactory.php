<?php

namespace Database\Factories;

use App\Models\OriginalTicket;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActiveTicket>
 */
class ActiveTicketFactory extends Factory
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
            'ticketListingId' => Str::random(10),
            'orderId' => Order::inRandomOrder()->value('id') ?? Order::factory()->create()->id,
        ];
    }
}
