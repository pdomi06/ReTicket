<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PasswordReset>
 */
class PasswordResetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'userId' => User::inRandomOrder()->first()->id ?? User::factory(),
            'token' => fake()->sha256(),
            'expiresAt' => fake()->dateTimeBetween('+1 hour', '+1 day'),
            'verifiedAt' => fake()->dateTimeBetween('-1 day', 'now'),
            'created_at' => now(),
        ];
    }
}
