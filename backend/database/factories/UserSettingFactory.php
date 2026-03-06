<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserSetting>
 */
class UserSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $visibility = ["visible", "restricted", "banned"];
        return [
            'userid' => User::inRandomOrder()->first()->id ?? User::factory(),
            'emailNotification' => fake()->boolean(50),
            'smsNotification' => fake()->boolean(50),
            'profileVisibility' => fake()->randomElement($visibility),
            'createdAt' => now(),
            'updatedAt' => now(),
        ];
    }
    public function forUser(User $user){
        return $this->state(function (array $attributes) use ($user) {
            return [
                'userid' => $user->id,
            ];
        });
    }
}
