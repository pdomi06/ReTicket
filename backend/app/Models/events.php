<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class events extends Model
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
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $casts= [
        'eventDate' => 'datetime',
        'eventEndDate' => 'datetime'
    ];

    //public $timestamps = false;
}
