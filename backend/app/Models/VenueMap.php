<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenueMap extends Model
{
    /** @use HasFactory<\Database\Factories\VenueMapFactory> */
    use HasFactory;

    protected $table = 'venue_maps';
    protected $fillable = [
        'venue',
        'section',
        'rows',
        'cols',
        'rate',
        'organizer_id'
    ];

      public function scopeSearch($query, array $filters) {
        return $query
            ->when($filters['venue'] ?? null, fn($q, $value) =>
                $q->where('venue', 'like', '%' . $value . '%')
            )
            ->when($filters['section'] ?? null, fn($q, $value) =>
                $q->where('section', 'like', '%' . $value . '%')
            )
            ->when($filters['rows'] ?? null, fn($q, $value) =>
                $q->where('rows', $value)
            )
            ->when($filters['cols'] ?? null, fn($q, $value) =>
                $q->where('cols', $value)
            )
            ->when($filters['rate'] ?? null, fn($q, $value) =>
                $q->where('rate', $value)
            );
    }

    public $timestamps = false;
}
