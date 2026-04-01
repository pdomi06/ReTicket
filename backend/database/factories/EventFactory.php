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
        $randomPicture = "https://picsum.photos/" . fake()->numberBetween(1920, 2000) . "/". fake()->numberBetween(1080, 1500);
        $eventDate = fake()->dateTimeBetween('+1 day', '+6 months');
        $eventEndDate = (clone $eventDate)->modify('+' . fake()->numberBetween(1, 8) . ' hours');

        return [
            'name' => fake()->words(2, true),
            'description' => fake()->paragraph(),
            'venue' => fake()->company(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => fake()->country(),
            'eventDate' => $eventDate->getTimestamp(),
            'eventEndDate' => $eventEndDate->getTimestamp(),
            'category' => fake()->randomElement($category),
            'basePrice' => fake()->randomFloat(2, 10, 1000),
            'imageUrl' => $randomPicture,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
