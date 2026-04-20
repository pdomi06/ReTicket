<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('ticket_forsale', function (Blueprint $table) {
            $table->id();
            $table->foreignId('originalTicketId')->constrained('original_tickets')->onDelete('cascade')->index();
            $table->foreignId('fromUserId')->nullable()->constrained('users')->onDelete('cascade')->index();
            $table->foreignId('eventId')->constrained('events')->onDelete('cascade')->index();
            $table->decimal('price', 10, 2);
            $table->boolean('inBasket');
            $table->timestamp('reservationStartedAt')->nullable();
            $table->boolean('isResell')->default(false)->index();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_forsale');
    }
};
