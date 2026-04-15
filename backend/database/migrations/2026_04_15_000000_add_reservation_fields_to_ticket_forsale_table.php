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
            $table->string('basket_token', 36)->nullable()->after('inBasket');
            $table->timestamp('reservation_started_at')->nullable()->after('basket_token');
            $table->timestamp('reservation_expires_at')->nullable()->after('reservation_started_at');
            $table->index('reservation_expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_forsale', function (Blueprint $table) {
            $table->dropIndex(['reservation_expires_at']);
            $table->dropColumn(['basket_token', 'reservation_started_at', 'reservation_expires_at']);
        });
    }
};
