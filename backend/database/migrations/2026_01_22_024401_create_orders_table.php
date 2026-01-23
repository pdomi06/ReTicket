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
            $table->text('buyerEmail');
            $table->decimal('subtotal');
            $table->decimal('platformFee');
            $table->decimal('tax')->nullable();
            $table->enum('status', ["pending", "processing", "completed", "failed", "refunded"]);
            $table->text('paymentIntentId');
            $table->enum('paymentStatus', ["pending", "authorized", "captured", "failed", "refunded"]);
            $table->text('deliveryEmail');
            $table->enum('deliverStatus', ["pending", "sent", "delivered"]);
            $table->date('deliveredAt');
            $table->date('createdAt');
            $table->date('updatedAt');
            $table->date('completedAt');
            $table->date('cancelledAt');
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
