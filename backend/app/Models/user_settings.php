<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class user_settings extends Model
{
    /** @use HasFactory<\Database\Factories\UserSettingsFactory> */
    use HasFactory;
    protected $table = "user_settings";
    protected $fillable = [
        'emailNotification',
        'smsNotification',
        'profileVisibility',
        'createdAt',
        'updatedAt'
    ];

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    /*public $timestamps = "false";*/
}
