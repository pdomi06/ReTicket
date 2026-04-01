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
        'created_at'
    ];
    protected $casts = [
        'expiresAt' => 'datetime',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
