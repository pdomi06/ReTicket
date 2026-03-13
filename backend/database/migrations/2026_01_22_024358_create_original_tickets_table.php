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
            $table->foreignId('eventId')->constrained('events')->onDelete('cascade');
            $table->text('section');
            $table->integer('row');
            $table->integer('seatNumber');
            $table->decimal('price', 10, 2);
            $table->enum('status', ["pre-release", "reserved", "active", "cancelled", "expired"]);
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
