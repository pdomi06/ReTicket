<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OriginalTicket>
 */
class OriginalTicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = ["pre-release", "reserved", "active", "cancelled", "expired"];
        return [
            'eventId' => Event::inRandomOrder()->first()->id ?? Event::factory(),
            'section' => fake()->randomLetter(),
            'row' => fake()->numberBetween(1, 100),
            'seatNumber' => fake()->numberBetween(1, 100),
            'price' => fake()->randomFloat(2, 10, 1000),
            'status' => fake()->randomElement($status),
            'ticketPdfUrl' => fake()->url(),
            'createdAt' => now(),
            'updatedAt' => now(),
        ];
    }
}
