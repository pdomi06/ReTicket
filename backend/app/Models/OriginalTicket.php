<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OriginalTicket extends Model
{
    /** @use HasFactory<\Database\Factories\OriginalTicketsFactory> */
    use HasFactory;

    protected $table = "original_tickets";

    protected $casts = [
        'row' => 'integer',
        'seatNumber' => 'integer',
    ];

    protected $fillable = [
        'eventId',
        'section',
        'row',
        'seatNumber',
        'price',
        'status',
        'ticketPdfUrl',
        'createdAt',
        'updatedAt'
    ];

        public function scopeSearch($query, array $filters) {
        return $query
            ->when($filters['eventId'] ?? null, fn($q, $value) =>
                $q->where('eventId', $value)
            )
            ->when($filters['section'] ?? null, fn($q, $value) =>
                $q->where('section', 'like', '%' . $value . '%')
            )
            ->when($filters['row'] ?? null, fn($q, $value) =>
                $q->where('row', $value)
            )
            ->when($filters['seatNumber'] ?? null, fn($q, $value) =>
                $q->where('seatNumber', $value)
            )
            ->when($filters['price'] ?? null, fn($q, $value) =>
                $q->where('price', $value)
            )
            ->when($filters['status'] ?? null, fn($q, $value) =>
                $q->where('status', $value)
            )
            ->when($filters['ticketPdfUrl'] ?? null, fn($q, $value) =>
                $q->where('ticketPdfUrl', $value)
            );
    }

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    //public $timestamps = false;
}
