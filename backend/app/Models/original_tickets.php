<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class original_tickets extends Model
{
    /** @use HasFactory<\Database\Factories\OriginalTicketsFactory> */
    use HasFactory;
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
    }
