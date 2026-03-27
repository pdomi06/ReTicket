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

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->unsignedBigInteger('organizer_id');
            $table->foreign('organizer_id')->references('id')->on('users')->onDelete('cascade');
            $table->text('description');
            $table->text('venue')->comment('this can be used for auto generate tickets');
            $table->text('address');
            $table->text('city');
            $table->text('state');
            $table->text('country');
            $table->date('eventDate');
            $table->date('eventEndDate');
            $table->enum('category', ["cultural", "music", "sport"]);
            $table->decimal('basePrice', 10, 2);
            $table->text('imageUrl');
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
        Schema::dropIfExists('events');
    }
};
