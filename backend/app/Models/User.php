<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Order;
use App\Models\TicketForSale;
use App\Models\UserSetting;
use App\Models\Payout;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = "users";


    protected $fillable = [
        'email',
        'role',
        'passwordHash',
        'name',
        'phone',
        'isVerified',
        'isActive',
        'isOnline',
        'lastLogin',
        'kycStatus',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'passwordHash',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'createdAt' => 'datetime',
            'updatedAt' => 'datetime',
            'lastLogin' => 'datetime',
            'passwordHash' => 'hashed',
        ];
    }

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    public function getAuthPassword()
    {
        return $this->passwordHash;
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'buyerEmail', 'email');
    }

    public function ticketsForSale()
    {
        return $this->hasMany(TicketForSale::class, 'fromUserId');
    }

    public function userSetting()
    {
        return $this->hasOne(UserSetting::class, 'userId');
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class, 'vendorId');
    }
}
