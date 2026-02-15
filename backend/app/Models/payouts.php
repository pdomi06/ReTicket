<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class payouts extends Model
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
        'createdAt'
    ];

    protected $casts = [
        'paidAt' => "datetime",
    ];
    //const CREATED_AT = "createdAt";

    public $timestamps = false;
}
