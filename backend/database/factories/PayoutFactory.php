<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payout>
 */
class PayoutFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = ["created", "pending", "cancelled", "fulfilled"];
        return [
            'vendorId' => User::inRandomOrder()->first()->id ?? User::factory(),
            'orderItemId' => OrderItem::inRandomOrder()->first()->id ?? OrderItem::factory(),
            'status' => fake()->randomElement($status),
            'bank' => fake()->company(),
            'iban' => fake()->iban(),
            'paidAt' => fake()->dateTimeBetween('-1 week', 'now'),
            'createdAt' => now(),
        ];
    }
}
