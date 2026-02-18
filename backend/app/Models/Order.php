<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrdersFactory> */
    use HasFactory;

    protected $table = "orders";
    protected $fillable = [
        'orderNumber',
        'buyerEmail',
        'subtotal',
        'platformFee',
        'tax',
        'status',
        'paymentIntentId',
        'paymentStatus',
        'deliveryEmail',
        'deliverStatus',
        'deliveredAt',
        'createdAt',
        'updatedAt',
        'completedAt',
        'cancelledAt',
    ];

    protected $casts = [
        'deliveredAt' => 'datetime',
        'completedAt'=> 'datetime',
        'cancelledAt' => 'datetime',
    ];
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    
    //public $timestamps = false;
}
