<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketForSale extends Model
{
    use HasFactory;

    public const RESERVATION_MINUTES = 30;

    public $timestamps = false;

    protected $table = 'ticket_forsale';

    protected $fillable = [
        'originalTicketId',
        'fromUserId',
        'eventId',
        'price',
        'inBasket',
        'reservationStartedAt',
    ];

    protected $casts = [
        'inBasket' => 'boolean',
        'reservationStartedAt' => 'datetime',
    ];

    public function scopeExpired($query)
    {
        return $query
            ->where('inBasket', true)
            ->whereNotNull('reservationStartedAt')
            ->where('reservationStartedAt', '<', now()->subMinutes(self::RESERVATION_MINUTES));
    }

    /**
     * Returns true when the ticket is held by someone and that hold has not expired.
     */
    public function hasActiveReservation(): bool
    {
        return $this->inBasket
            && $this->reservationStartedAt !== null
            && $this->reservationStartedAt->gt(now()->subMinutes(self::RESERVATION_MINUTES));
    }

    public function scopeSearch($query, array $filters)
    {
        return $query
            ->when($filters['originalTicketId'] ?? null, fn($q, $value) =>
                $q->where('originalTicketId', $value)
            )
            ->when($filters['fromUserId'] ?? null, fn($q, $value) =>
                $q->where('fromUserId', $value)
            )
            ->when($filters['eventId'] ?? null, fn($q, $value) =>
                $q->where('eventId', $value)
            )
            ->when($filters['price'] ?? null, fn($q, $value) =>
                $q->where('price', $value)
            )
            ->when($filters['inBasket'] ?? null, fn($q, $value) =>
                $q->where('inBasket', $value)
            );
    }

    public function originalTicket()
    {
        return $this->belongsTo(OriginalTicket::class, 'originalTicketId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'fromUserId');
    }

    /**
     * @deprecated Use user() instead.
     */
    public function fromUser()
    {
        return $this->user();
    }
}
