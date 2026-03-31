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
        'paidAt',
    ];

    protected $casts = [
        'paidAt' => "datetime",
    ];
    //const CREATED_AT = "createdAt";

    public $timestamps = false;

    public function orderItem(){
        return $this->belongsTo(OrderItem::class, 'orderItemId');
    }

    public function user(){
        return $this->belongsTo(User::class, 'vendorId');
    }
}
