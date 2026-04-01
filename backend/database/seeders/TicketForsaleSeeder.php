<?php

namespace Database\Seeders;

use App\Models\TicketForSale;
use Illuminate\Database\Seeder;

class TicketForsaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TicketForSale::factory(10)->create();
    }
}
