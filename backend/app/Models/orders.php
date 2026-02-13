<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class orders extends Model
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
        'completedAt'=> 'datetime',
        'cancelledAt' => 'datetime',
    ];
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    
    /*public $timestamps = "false";*/
}
