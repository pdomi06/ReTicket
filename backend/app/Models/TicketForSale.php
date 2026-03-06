<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketForSale extends Model
{
    /** @use HasFactory<\Database\Factories\TicketForsaleFactory> */
    use HasFactory;

    protected $table = "ticket_forsale";

    public function originalTicket(){
        return $this->belongsTo(OriginalTicket::class, 'originalTicketId');
    }

    public function user(){
        return $this->belongsTo(User::class, 'fromUserId');
    }

    protected $fillable = [
        'originalTicketId',
        'fromUserId',
        'price',
        'inBasket'
    ];

    public $timestamps = false;
}
