<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_forsale', function (Blueprint $table) {
            $table->timestamp('reservation_started_at')->nullable()->after('inBasket');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_forsale', function (Blueprint $table) {
            $table->dropColumn(['reservation_started_at']);
        });
    }
};
