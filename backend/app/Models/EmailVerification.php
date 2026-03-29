<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
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
