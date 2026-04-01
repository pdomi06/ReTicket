<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemsFactory> */
    use HasFactory;

    protected $table = "order_item";



    protected $fillable = [
        'orderId',
        'ticketListingId',
        'price',
        'created_at'
    ];


    public function ticketForSale()
    {
        return $this->belongsTo(TicketForSale::class, 'ticketListingId');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }
}
