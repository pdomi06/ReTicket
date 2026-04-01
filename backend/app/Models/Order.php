<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $table = "orders";

    protected $fillable = [
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
        'created_at',
        'updated_at',
        'completedAt',
        'cancelledAt',
    ];

    protected $casts = [
        'deliveredAt' => 'datetime',
        'completedAt' => 'datetime',
        'cancelledAt' => 'datetime',
    ];
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'buyerEmail', 'email');
    }
}
