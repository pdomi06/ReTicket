<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class password_reset extends Model
{
    /** @use HasFactory<\Database\Factories\PasswordResetFactory> */
    use HasFactory;
    protected $fillable = [
        'userId',
        'token',
        'expiresAt',
        'verifiedAt',
        'createdAt'
    ];
}
