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
            'userId' => User::factory(),
            'emailNotifications' => fake()->boolean(50),
            'smsNotifications' => fake()->boolean(50),
            'profileVisibility' => fake()->randomElement($visibility),
            'createdAt' => now(),
            'updatedAt' => now(),
        ];
    }
}
