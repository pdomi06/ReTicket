<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::chunkById(200, function ($users) {
            $userIds = $users->pluck('id');
            $existing = UserSetting::whereIn('userId', $userIds)->pluck('userId')->all();
            $existingLookup = array_flip($existing);

            foreach ($users as $user) {
                if (!isset($existingLookup[$user->id])) {
                    UserSetting::factory()->forUser($user)->create();
                }
            }
        });
    }
}
