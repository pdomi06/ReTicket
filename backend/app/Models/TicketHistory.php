<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketHistory extends Model
{
    /** @use HasFactory<\Database\Factories\TicketHistoryFactory> */
    use HasFactory;

    protected $table = "ticket_history";
    protected $fillable = [
        'originalTicketId',
        'ticketListingId',
        'fromUserId',
        'toUser',
        'price',
        'platformFee',
    ];

    public $timestamps = false;
}
