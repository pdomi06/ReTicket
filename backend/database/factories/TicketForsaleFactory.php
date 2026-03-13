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
            'originalTicketId' => OriginalTicket::inRandomOrder()->value('id') ?? OriginalTicket::factory(),
            'fromUserId' => User::inRandomOrder()->value('id') ?? User::factory(),
            'eventId' => Event::inRandomOrder()->value('id') ?? Event::factory(),
            'price' => fake()->randomFloat(2, 10, 100),
            'inBasket' => fake()->boolean(),
        ];
    }
}
