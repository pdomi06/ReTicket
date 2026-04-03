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

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('orderNumber')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('platformFee', 10, 2);
            $table->decimal('tax', 10, 2)->nullable();
            $table->enum('status', ["created", "processing", "completed", "failed", "cancelled", "refunded"])->default("created");
            $table->text('paymentIntentId')->nullable();
            $table->enum('paymentStatus', ["pending", "authorized", "captured", "failed"])->nullable();
            $table->text('deliveryEmail')->nullable();
            $table->enum('deliverStatus', ["pending", "sent", "delivered"])->nullable();
            $table->date('deliveredAt')->nullable();
            $table->timestamps();
            $table->dateTime('completedAt')->nullable();
            $table->dateTime('cancelledAt')->nullable();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
