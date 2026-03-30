<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    /** @use HasFactory<\Database\Factories\EmailVerifyFactory> */
    use HasFactory;
    protected $table = "email_verify";

    protected $fillable = [
        'userId',
        'token',
        'expiresAt',
        'verifiedAt',
        'createdAt',
    ];
    protected $casts= [
        'expiresAt' => 'datetime',
        'verifiedAt' => 'datetime',
    ];
    const CREATED_AT = 'createdAt';
    public $timestamps = false;

}
