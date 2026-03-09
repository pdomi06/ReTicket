<?php

namespace Database\Seeders;

use App\Models\ActiveTicket;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActiveTicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ActiveTicket::factory(10)->create();
    }
}
