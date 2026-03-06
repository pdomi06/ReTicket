<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VenueMap>
 */
class VenueMapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'venue' => fake()->company(),
            'section' => fake()->randomLetter(),
            'rows' => fake() -> numberBetween(1,100),
            'cols' => fake() -> numberBetween(1,100),
            'rate' => fake() -> randomFloat(1, 1, 5),
        ];
    }
}
