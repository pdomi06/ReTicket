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

        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendorId')->constrained('users')->onDelete('cascade');
            $table->foreignId('orderItemId')->constrained('order_item')->onDelete('cascade');
            $table->enum('status', ["created", "pending", "cancelled", "fulfilled"]);
            $table->text('bank');
            $table->text('iban');
            $table->date('paidAt');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
