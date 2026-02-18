<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActiveTicket extends Model
{
    /** @use HasFactory<\Database\Factories\ActiveTicketsFactory> */
    use HasFactory;

    protected $table = "active_tickets";
    protected $fillable = [
        'originalTickedId',
        'ticketListingId',
    ];
    
    //public $timestamps = false;
}
