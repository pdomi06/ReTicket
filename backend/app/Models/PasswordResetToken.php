<?php

namespace App\Models;

use Database\Factories\PasswordResetFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    /** @use HasFactory<\Database\Factories\PasswordResetFactory> */
    use HasFactory;

    protected $table = 'password_reset';

    protected $primaryKey = 'email';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'email',
        'token',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    protected static function newFactory(): PasswordResetFactory
    {
        return PasswordResetFactory::new();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }
}