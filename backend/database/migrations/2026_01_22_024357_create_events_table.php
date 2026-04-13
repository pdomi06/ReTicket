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
            $table->text('description');
            $table->text('venue')->comment('this can be used for auto generate tickets');
            $table->text('address');
            $table->text('city');
            $table->text('state');
            $table->text('country');
            $table->unsignedBigInteger('eventDate');
            $table->unsignedBigInteger('eventEndDate');
            $table->enum('category', ["cultural", "music", "sport"]);
            $table->decimal('basePrice', 10, 2);
            $table->text('imageUrl');
            $table->boolean('isFeatured')->default(false);
            $table->unsignedBigInteger('views')->default(0);
            $table->foreignId('createdBy')->constrained('users');
            $table->timestamps();
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
