<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class original_tickets extends Model
{
    /** @use HasFactory<\Database\Factories\OriginalTicketsFactory> */
    use HasFactory;

    protected $table = "original_tickets";
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

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    /*public $timestamps = "false";*/
}
