<?php

namespace Database\Factories;

use App\Models\OriginalTicket;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
            'originalTicketId' => OriginalTicket::inRandomOrder()->value('id') ?? OriginalTicket::factory()->create()->id,
            'ticketListingId' => Str::random(10),
            'orderId' => Order::inRandomOrder()->value('id') ?? Order::factory()->create()->id,
            'isValidated' => false,
            'validatedAt' => null,
        ];
    }
}
