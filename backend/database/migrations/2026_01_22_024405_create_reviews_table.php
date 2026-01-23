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

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('orderItemId');
            $table->foreign('orderItemId')->references('id')->on('order_item');
            $table->text('reviewerName');
            $table->bigInteger('revieweduserId');
            $table->foreign('reviewedUserId')->references('id')->on('user');
            $table->smallInteger('rating');
            $table->text('title');
            $table->text('comment');
            $table->boolean('isVisible')->comment('to check before its visible (can be automated with simple word filter or ai)');
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
        Schema::dropIfExists('reviews');
    }
};
