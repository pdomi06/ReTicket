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
        'toUserId',
        'price',
        'platformFee',
    ];

    protected $casts = [
        'originalTicketId' => 'integer',
        'fromUserId' => 'integer',
        'toUserId' => 'integer',
    ];

    public $timestamps = false;

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'fromUserId');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'toUserId');
    }
}
