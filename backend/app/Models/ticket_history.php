<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ticket_history extends Model
{
    /** @use HasFactory<\Database\Factories\TicketHistoryFactory> */
    use HasFactory;

    protected $table = "ticket_history";
    protected $fillable = [
        'originalTicketId',
        'ticketListingId',
        'fromUserId',
        'toUserId',
        'price',
        'platformFee',
    ];

    public $timestamps = false;
}
