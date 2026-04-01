<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = ["pending", "processing", "completed", "failed", "refunded"];
        $paymentStatus = ["pending", "authorized", "captured", "failed", "refunded"];
        $deliverStatus = ["pending", "sent", "delivered"];
        return [
            'orderNumber' => fake()->unique()->numberBetween(1000000, 9999999),
            'buyerEmail' => fake()->unique()->safeEmail(),
            'subtotal' => fake()->randomFloat(2, 10, 500),
            'platformFee' => fake()->randomFloat(2, 1, 50),
            'tax' => fake()->optional()->randomFloat(2, 0.5, 20),
            'status' => fake()->randomElement($status),
            'paymentIntentId' => 'pi_' . fake()->unique()->regexify('[A-Za-z0-9]{24}'),
            'paymentStatus' => fake()->randomElement($paymentStatus),
            'deliveryEmail' => fake()->unique()->safeEmail(),
            'deliverStatus' => fake()->randomElement($deliverStatus),
            'deliveredAt' => fake()->dateTimeBetween('-1 month', 'now'),
            'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'completedAt' => fake()->dateTimeBetween('-1 month', 'now'),
            'cancelledAt' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
