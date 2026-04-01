<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewsFactory> */
    use HasFactory;

    protected $table = "reviews";
    protected $fillable = [
        'orderItemId',
        'reviewerName',
        'reviewedUserId',
        'rating',
        'title',
        'comment',
        'isVisible',
        'created_at',
        'updated_at'
    ];

    public function orderItem(){
        return $this->belongsTo(OrderItem::class, 'orderItemId');
    }

    public function user(){
        return $this->belongsTo(User::class, 'reviewedUserId'); 
    }
}
