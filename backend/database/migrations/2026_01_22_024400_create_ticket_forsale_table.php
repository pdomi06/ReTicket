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
            $table->bigInteger('originalTicketId');
            $table->foreign('originalTicketId')->references('id')->on('original_tickets');
            $table->bigInteger('fromUserId');
            $table->foreign('fromUserId')->references('id')->on('user');
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
