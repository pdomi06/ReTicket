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
            $table->foreignId('originalTicketId')->constrained('original_tickets');
            $table->foreignId('fromUserId')->nullable()->constrained('user');
            $table->decimal('price');
            $table->boolean('inBasket');
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
