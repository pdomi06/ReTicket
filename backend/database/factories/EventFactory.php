<?php

namespace Database\Factories;

use App\Models\User;
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
        return [
            'name' => fake()->words(2, true),
            'organizer_id' => User::factory()->state([
                'role' => 'organizer',
            ]),
            'description' => fake()->paragraph(),
            'venue' => fake()->company(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => fake()->country(),
            'eventDate' => fake()->date(),
            'eventEndDate' => fake()->date(),
            'category' => fake()->randomElement($category),
            'basePrice' => fake()->randomFloat(2, 10, 1000),
            'imageUrl' => $randomPicture,
            'createdAt' => now(),
            'updatedAt' => now(),
        ];
    }
}
