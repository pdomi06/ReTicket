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
            $table->bigInteger('originalTicketId');
            $table->foreign('originalTicketId')->references('id')->on('original_tickets');
            $table->bigInteger('ticketListingId');
            $table->bigInteger('fromUserId');
            $table->foreign('fromUserId')->references('id')->on('user');
            $table->bigInteger('toUserId');
            $table->foreign('toUserId')->references('id')->on('user');
            $table->decimal('price');
            $table->decimal('platformFee');
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
