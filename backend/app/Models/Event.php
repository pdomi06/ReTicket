<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventsFactory> */
    use HasFactory;

    protected $table = 'events';
    protected $fillable = [
        'name',
        'description',
        'venue',
        'address',
        'city',
        'state',
        'country',
        'eventDate',
        'eventEndDate',
        'category',
        'imageUrl',
        'createdAt',
        'updatedAt',
    ];

    public function originalTickets(){
        return $this->hasMany(OriginalTicket::class, 'eventId');
    }

    public function scopeSearch($query, array $filters) {
        return $query
            ->when($filters['event'] ?? null, fn($q, $value) =>
                $q->where('name', 'like', '%' . $value . '%')
            )
            ->when($filters['venue'] ?? null, fn($q, $value) =>
                $q->where('venue', 'like', '%' . $value . '%')
            )
            ->when($filters['city'] ?? null, fn($q, $value) =>
                $q->where('city', 'like', '%' . $value . '%')
            )
            ->when($filters['date'] ?? null, fn($q, $value) =>
                $q->whereDate('eventDate', '=', $value)
            )
            ->when($filters['category'] ?? null, fn($q, $value) =>
                $q->where('category', $value)
            )
            ->when($filters['maxPrice'] ?? null, fn($q, $value) =>
                $q->whereHas('originalTickets', fn($q) =>
                    $q->where('price', '<=', $value)
                )
            );
    }
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $casts= [
        'eventDate' => 'datetime',
        'eventEndDate' => 'datetime'
    ];

    //public $timestamps = false;
}
