<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerify extends Model
{
    /** @use HasFactory<\Database\Factories\EmailVerifyFactory> */
    use HasFactory;

    protected $table = "email_verify";

    protected $fillable = [
        'userId',
        'token',
        'expiresAt',
        'verifiedAt',
        'created_at',
    ];
    protected $casts= [
        'expiresAt' => 'datetime',
        'verifiedAt' => 'datetime',
    ];

}
