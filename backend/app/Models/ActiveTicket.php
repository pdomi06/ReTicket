<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActiveTicket extends Model
{
    /** @use HasFactory<\Database\Factories\ActiveTicketFactory> */
    use HasFactory;

    protected $table = "active_tickets";
    protected $fillable = [
        'originalTicketId',
        'ticketListingId',
        'orderId',
    ];

    public function originalTicket()
    {
        return $this->belongsTo(OriginalTicket::class, 'originalTicketId');
    }

    public function ticketListing()
    {
        return $this->belongsTo(TicketForSale::class, 'ticketListingId');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }

    public $timestamps = false;
}
