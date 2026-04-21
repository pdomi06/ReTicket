<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Order;
use App\Models\TicketForSale;
use App\Models\UserSetting;
use App\Models\Payout;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable, CanResetPassword;

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
        'kycStatus',
        'created_at',
        'updated_at',
        'lastLogin',
        'email_verified_at'
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
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'lastLogin' => 'datetime',
            'passwordHash' => 'hashed',
            'isVerified' => 'boolean',
            'email_verified_at' => 'datetime',
        ];
    }

    public function getAuthPassword()
    {
        return $this->passwordHash;
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'deliveryEmail', 'email');
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

    protected static function booted(): void
    {
        static::saving(function (self $user): void {
            if ($user->isDirty('email_verified_at')) {
                $user->isVerified = $user->email_verified_at !== null;

                return;
            }

            if ($user->isDirty('isVerified')) {
                $user->email_verified_at = $user->isVerified ? ($user->email_verified_at ?? now()) : null;
            }
        });
    }

    public function hasVerifiedEmail(): bool
    {
        if ($this->email_verified_at !== null) {
            return true;
        }

        return $this->isVerified === true;
    }

    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => now(),
            'isVerified' => true,
        ])->save();
    }

    public function markEmailAsUnverified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => null,
            'isVerified' => false,
        ])->save();
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification);
    }
    public function getEmailForVerification()
    {
        return $this->email;
    }
}
