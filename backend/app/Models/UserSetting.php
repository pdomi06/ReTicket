<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    /** @use HasFactory<\Database\Factories\UserSettingsFactory> */
    use HasFactory;
    protected $table = "user_settings";
    public $primaryKey = 'userid';
    public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = [
        'userid',
        'emailNotification',
        'smsNotification',
        'profileVisibility',
        'createdAt',
        'updatedAt'
    ];

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    //public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'userid');
    }
}
