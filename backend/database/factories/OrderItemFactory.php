<?php

namespace Database\Factories;

use App\Models\ActiveTicket;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'orderId' => Order::inRandomOrder()->value('id') ?? Order::factory(),
            'ticketListingId' => ActiveTicket::inRandomOrder()->value('ticketListingId') ?? ActiveTicket::factory()->create()->ticketListingId,
            'price' => fake()->randomFloat(2, 10, 1000),
            'createdAt' => now(),
        ];
    }
}
