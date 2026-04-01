<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    /** @use HasFactory<\Database\Factories\PayoutsFactory> */
    use HasFactory;

    protected $table = "payouts";
    protected $fillable = [
        'vendorId',
        'orderItemId',
        'status',
        'bank',
        'iban',
        'paidAt',
        'created_at'
    ];

    protected $casts = [
        'paidAt' => "datetime",
    ];
    public function orderItem(){
        return $this->belongsTo(OrderItem::class, 'orderItemId');
    }

    public function user(){
        return $this->belongsTo(User::class, 'vendorId');
    }
}
