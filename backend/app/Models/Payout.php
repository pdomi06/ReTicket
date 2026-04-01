<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    /** @use HasFactory<\Database\Factories\PayoutFactory> */
    use HasFactory;

    protected $table = "payouts";
    protected $fillable = [
        'vendorId',
        'orderItemId',
        'status',
        'bank',
        'iban',
        'createdAt',
        'paidAt',
    ];

    protected $casts = [
        'createdAt' => "datetime",
        'paidAt' => "datetime",
    ];
    const CREATED_AT = "createdAt";
    const UPDATED_AT = null;

    public $timestamps = true;

    public function orderItem(){
        return $this->belongsTo(OrderItem::class, 'orderItemId');
    }

    public function user(){
        return $this->belongsTo(User::class, 'vendorId');
    }
}
