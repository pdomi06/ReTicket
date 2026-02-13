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

        Schema::create('user_settings', function (Blueprint $table) {
            $table->bigInteger('userid')->primary();
            $table->foreign('userid')->references('id')->on('user');
            $table->boolean('emailNotification');
            $table->boolean('smsNotification');
            $table->enum('profileVisibility', ["visible", "restricted", "banned"]);
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
        Schema::dropIfExists('user_settings');
    }
};
