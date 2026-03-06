<?php

namespace Database\Seeders;

use App\Models\EmailVerify;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmailVerifySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EmailVerify::factory(10)->create();
    }
}
