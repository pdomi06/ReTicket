<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\OrderItemsFactory> */
    use HasFactory;

    protected $table = "order_items";

    public function order(){
        return $this->belongsTo(Order::class);
    }

    public function ticketForSale(){
        return $this->belongsTo(TicketForSale::class);
    }

    public function payout(){
        return $this->hasOne(Payout::class);
    }

    public function review(){
        return $this->hasOne(Review::class);
    }
    
    protected $fillable = [
        'orderId',
        'ticketListingId',
        'price',
        'createdAt'
    ];
    //const CREATED_AT = 'createdAt';

    public $timestamps = false;
}
