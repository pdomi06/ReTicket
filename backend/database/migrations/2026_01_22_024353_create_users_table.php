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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->text('email');
            $table->text('passwordHash');
            $table->text('name');
            $table->text('phone');
            $table->boolean('isVerified');
            $table->boolean('isActive');
            $table->boolean('isOnline');
            $table->enum('kycStatus', ["pending", "rejected", "approved"]);
            $table->date('createdAt');
            $table->date('updatedAt');
            $table->date('lastLogin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
