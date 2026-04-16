<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketForSale extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'ticket_forsale';

    protected $fillable = [
        'originalTicketId',
        'fromUserId',
        'eventId',
        'price',
        'inBasket',
        'reservation_started_at',
    ];

    protected $casts = [
        'inBasket' => 'boolean',
        'reservation_started_at' => 'datetime',
    ];

    public function scopeExpired($query)
    {
        return $query
            ->where('inBasket', true)
            ->whereNotNull('reservation_started_at')
            ->where('reservation_started_at', '<', now()->subMinutes(30));
    }

    /**
     * Returns true when the ticket is held by someone and that hold has not expired.
     */
    public function hasActiveReservation(): bool
    {
        return $this->inBasket
            && $this->reservation_started_at !== null
            && $this->reservation_started_at->gt(now()->subMinutes(30));
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

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'fromUserId');
    }
}
