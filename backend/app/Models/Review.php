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
        'reviewerName',
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
}
