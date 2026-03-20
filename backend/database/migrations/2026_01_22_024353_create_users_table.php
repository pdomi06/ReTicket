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
            $table->enum('role', ['vendor', 'organizer', 'admin'])->default('vendor');
            $table->text('email')->unique();
            $table->text('passwordHash');
            $table->text('name');
            $table->text('phone');
            $table->boolean('isVerified')->default(false);
            $table->boolean('isActive')->default(true);
            $table->boolean('isOnline')->default(false);
            $table->enum('kycStatus', ["pending", "rejected", "approved"])->default("pending");
            $table->dateTime('createdAt')->useCurrent();
            $table->dateTime('updatedAt')->useCurrent()->nullable();
            $table->dateTime('lastLogin')->nullable();
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
