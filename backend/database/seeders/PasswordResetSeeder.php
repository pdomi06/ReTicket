<?php

namespace Database\Seeders;

use App\Models\PasswordResetModel;
use Illuminate\Database\Seeder;

class PasswordResetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PasswordResetModel::factory(10)->create();
    }
}
