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
        'subtotal',
        'platformFee',
        'tax',
        'status',
        'paymentIntentId',
        'paymentStatus',
        'deliveryEmail',
        'deliveryStatus',
        'deliveredAt',
        'created_at',
        'updated_at',
        'completedAt',
        'cancelledAt',
    ];

    protected $appends = [
        'deliveryStatus',
    ];

    protected $casts = [
        'deliveredAt' => 'datetime',
        'completedAt' => 'datetime',
        'cancelledAt' => 'datetime',
    ];

    public function setDeliveryStatusAttribute(?string $value): void
    {
        $this->attributes['deliveryStatus'] = $value;
    }

    public function getDeliveryStatusAttribute(): ?string
    {
        return $this->attributes['deliveryStatus'] ?? null;
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }

    public function activeTickets()
    {
        return $this->hasMany(ActiveTicket::class, 'orderId');
    }

}
