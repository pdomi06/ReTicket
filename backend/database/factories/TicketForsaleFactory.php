<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\OriginalTicket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketForSale>
 */
class TicketForSaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'originalTicketId' => OriginalTicket::inRandomOrder()->first()->id ?? OriginalTicket::factory(),
            'fromUserId' => User::inRandomOrder()->first()->id ?? User::factory(),
            'eventId' => Event::inRandomOrder()->first()->id ?? Event::factory(),
            'price' => fake()->randomFloat(2, 10, 100),
            'inBasket' => fake()->boolean(),
        ];
    }
}
