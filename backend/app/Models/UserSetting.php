<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    /** @use HasFactory<\Database\Factories\UserSettingFactory> */
    use HasFactory;
    protected $table = "user_settings";
    public $primaryKey = 'userId';
    public $incrementing = false;
    protected $keyType = 'int';
    protected $fillable = [
        'userId',
        'emailNotification',
        'smsNotification',
        'profileVisibility',
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
