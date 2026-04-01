<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reviewerName' => fake()->name(),
            'rating' => fake()->numberBetween(1, 5),
            'title' => fake()->words(3, true),
            'comment' => fake()->sentence(),
            'isVisible' => fake()->boolean(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
