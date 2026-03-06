<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = ["cultural", "music", "sport"];
        return [
            'name' => fake()->words(2, true),
            'description' => fake()->paragraph(),
            'venue' => fake()->company(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => fake()->country(),
            'eventDate' => fake()->date(),
            'eventEndDate' => fake()->date(),
            'category' => fake()->randomElement($category),
            'basePrice' => fake()->numberBetween(10, 1000),
            'imageUrl' => fake()->imageUrl(),
            'createdAt' => now(),
            'updatedAt' => now(),
        ];
    }
}
