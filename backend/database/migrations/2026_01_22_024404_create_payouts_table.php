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
            $table->bigInteger('vendorId');
            $table->foreign('vendorId')->references('id')->on('user');
            $table->bigInteger('orderItemId');
            $table->foreign('orderItemId')->references('id')->on('order_item');
            $table->enum('status', ["created", "pending", "cancelled", "fulfilled"]);
            $table->text('bank');
            $table->text('iban');
            $table->date('paidAt');
            $table->date('createdAt');
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
