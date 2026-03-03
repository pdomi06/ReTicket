<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = "user";

    public function orders(){
        return $this->hasMany(Order::class);
    }

    public function ticketForSale(){
        return $this->hasMany(TicketForSale::class);
    }

    public function userSettings(){
        return $this->hasOne(UserSettings::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }

    protected $fillable = [
        'email',
        'passwordHash',
        'name',
        'phone',
        'isVerified',
        'isActive',
        'isOnline',
        'kycStatus',
        'createdAt',
        'updatedAt',
        'lastLogin'
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

    public function getAuthPassword(){
        return $this->passwordHash;
    }
}
