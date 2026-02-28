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
        Schema::create('venue_maps', function (Blueprint $table) {
            $table->id();
            $table->text('venue');
            $table->text('section');
            $table->text('rows');
            $table->text('cols');
            $table->decimal('rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_maps');
    }
};
