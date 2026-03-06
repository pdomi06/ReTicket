<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OriginalTicket extends Model
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

    //public $timestamps = false;

    public function event(){
        return $this->belongsTo(Event::class, 'eventId');
    }

    public function ticketForSale(){
        return $this->hasMany(TicketForSale::class, 'originalTicketId');
    }
}
