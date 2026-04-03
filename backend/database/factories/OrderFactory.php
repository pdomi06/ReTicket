<?php

namespace Database\Factories;

use App\Models\User;
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
        $status = ["created", "processing", "completed", "failed", "cancelled", "refunded"];
        $paymentStatus = ["pending", "authorized", "captured", "failed"];
        $deliverStatus = ["pending", "sent", "delivered"];
        $orderNumber = fake()->unique()->numberBetween(1000000, 9999999);
        

        $user = User::inRandomOrder()->first() ?? User::factory()->create();
        return [
            'orderNumber' => $orderNumber,
            'subtotal' => fake()->randomFloat(2, 10, 500),
            'platformFee' => fake()->randomFloat(2, 1, 50),
            'tax' => fake()->optional()->randomFloat(2, 0.5, 20),
            'status' => fake()->randomElement($status),
            'paymentIntentId' => 'pi_' . fake()->unique()->regexify('[A-Za-z0-9]{24}'),
            'paymentStatus' => fake()->randomElement($paymentStatus),
            'deliveryEmail' => $user->email,
            'deliverStatus' => fake()->randomElement($deliverStatus),
            'deliveredAt' => fake()->dateTimeBetween('-1 month', 'now'),
            'created_at' => fake()->dateTimeBetween('-2 months', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'completedAt' => fake()->dateTimeBetween('-1 month', 'now'),
            'cancelledAt' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
