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
        'createdAt',
        'updatedAt'
    ];
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    //public $timestamps = false;

    public function orderItem(){
        return $this->belongsTo(OrderItem::class, 'orderItemId');
    }

    public function user(){
        return $this->belongsTo(User::class, 'reviewedUserId'); 
    }
}
