<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\TicketForSale;
use Illuminate\Database\Eloquent\Factories\Factory;
use Number;

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
            'orderId' => Order::inRandomOrder()->first()->id ?? Order::factory(),
            'ticketListingId' => ActiveTicket::inRandomOrder()->first()->ticketListingId ?? ActiveTicket::factory(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'createdAt' => now(),
        ];
    }
}
