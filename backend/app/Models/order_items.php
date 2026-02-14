<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class order_items extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemsFactory> */
    use HasFactory;

    protected $table = "order_items";
    protected $fillable = [
        'orderId',
        'ticketListingId',
        'price',
        'createdAt'
    ];
    const CREATED_AT = 'createdAt';

    /*public $timestamps = "false";*/
}
