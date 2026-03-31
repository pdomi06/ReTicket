<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemFactory> */
    use HasFactory;

    protected $table = "order_item";

    protected $fillable = [
        'orderId',
        'ticketListingId',
        'price',
    ];
    const CREATED_AT = 'createdAt';

    public $timestamps = false;


    public function activeTicket()
    {
        return $this->belongsTo(ActiveTicket::class, 'ticketListingId', 'ticketListingId');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId');
    }
}
