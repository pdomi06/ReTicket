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

        Schema::create('order_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orderId')->constrained('orders')->onDelete('cascade');
            $table->text('ticketListingId')->unique();
            $table->decimal('price', 10, 2);
            $table->timestamp('createdAt')->useCurrent();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item');
    }
};
