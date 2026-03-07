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
            ->when($filters['inBasket'] ?? null, fn($q, $value) =>
                $q->where('inBasket', $value)
            );
    }
}
