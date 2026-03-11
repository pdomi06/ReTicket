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

        Schema::create('ticket_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('originalTicketId')->constrained('original_tickets')->onDelete('cascade');
            $table->text('ticketListingId');
            $table->foreignId('fromUserId')->nullable()->constrained('user')->onDelete('cascade');
            $table->text('toUser');
            $table->decimal('price', 10, 2);
            $table->decimal('platformFee', 10, 2);
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_history');
    }
};
