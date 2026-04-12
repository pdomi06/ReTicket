<?php

namespace Database\Seeders;

use App\Models\PasswordResetToken;
use Illuminate\Database\Seeder;

class PasswordResetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PasswordResetToken::factory(10)->create();
    }
}
