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
        'isResell',
        'inBasket',
    ];

    protected $casts = [
        'isResell' => 'boolean',
        'inBasket' => 'boolean',
    ];
    

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
            ->when($filters['isResell'] ?? null, fn($q, $value) =>
                $q->where('isResell', $value)
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
}
