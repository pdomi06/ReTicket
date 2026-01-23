<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class reviews extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewsFactory> */
    use HasFactory;
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
}
