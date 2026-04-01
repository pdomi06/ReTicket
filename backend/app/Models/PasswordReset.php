<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    /** @use HasFactory<\Database\Factories\PasswordResetFactory> */
    use HasFactory;

    protected $table = "password_reset";
    protected $fillable = [
        'userId',
        'token',
        'expiresAt',
        'verifiedAt',
        'createdAt'
    ];
    protected $casts = [
        'expiresAt' => 'datetime',
    ];
    //const CREATED_AT = 'createdAt';

    public $timestamps = false;
}
