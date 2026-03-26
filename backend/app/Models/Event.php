<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
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
        'basePrice',
        'imageUrl',
        'createdAt',
        'updatedAt',
    ];



    public function scopeSearch($query, array $filters)
    {
        $query->when(
            $filters['name'] ?? null,
            fn($q, $value) =>
            $q->where('name', 'like', '%' . $value . '%')
        )
        ->when(
            $filters['venue'] ?? null,
            fn($q, $value) =>
            $q->where('venue', 'like', '%' . $value . '%')
        )
        ->when(
            $filters['city'] ?? null,
            fn($q, $value) =>
            $q->where('city', 'like', '%' . $value . '%')
        )
        ->when($filters['country'] ?? null, fn($q, $value) =>
            $q->where('country', 'like', '%' . $value . '%')
        )
        ->when($filters['category'] ?? null, fn($q, $value) =>
            $q->where('category', $value)
        )
        ->when($filters['maxPrice'] ?? null, fn($q, $value) =>
            $q->where('basePrice', '<=', $value)
        );

        // Handle eventDate with timezone support
        if (!empty($filters['eventDate'])) {
            $userTimezone = $filters['timezone'] ?? '+00:00';
            $date = Carbon::createFromFormat('Y-m-d', $filters['eventDate'], $userTimezone);
            $query->whereBetween('eventDate', [
                $date->copy()->startOfDay()->timestamp,
                $date->copy()->endOfDay()->timestamp,
            ]);
        }

        return $query;
    }
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $casts = [
        'eventDate' => 'integer',
        'eventEndDate' => 'integer'
    ];

    //public $timestamps = false;

    public function originalTickets()
    {
        return $this->hasMany(OriginalTicket::class, 'eventId');
    }
}
