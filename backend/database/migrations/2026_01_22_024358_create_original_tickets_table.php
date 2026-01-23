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

        Schema::create('original_tickets', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('eventId');
            $table->foreign('eventId')->references('id')->on('events');
            $table->text('section');
            $table->text('row');
            $table->text('seatNumber');
            $table->integer('price');
            $table->enum('status', ["pre-release", "active", "cancelled", "expired"]);
            $table->text('ticketPdfUrl');
            $table->date('createdAt');
            $table->date('updatedAt');
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('original_tickets');
    }
};
