<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketForSale extends Model
{
    /** @use HasFactory<\Database\Factories\TicketForsaleFactory> */
    use HasFactory;

    protected $table = "ticket_forsale";
    protected $fillable = [
        'originalTicketId',
        'fromUserId',
        'price',
        'inBasket'
    ];

    public $timestamps = false;
}
