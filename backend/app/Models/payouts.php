<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class payouts extends Model
{
    /** @use HasFactory<\Database\Factories\PayoutsFactory> */
    use HasFactory;

    protected $fillable = [
        'vendorId',
        'orderItemId',
        'status',
        'bank',
        'iban',
        'paidAt',
        'createdAt'
    ];
}
