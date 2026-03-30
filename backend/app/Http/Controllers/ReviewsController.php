<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewsRequest;
use App\Http\Requests\UpdateReviewsRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ReviewsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::where('isVisible', true)->get();
        return response()->json($reviews, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewsRequest $request)
    {
        $this->authorize('create', Review::class);
        $data = $request->validated();
        $data['isVisible'] = $data['isVisible'] ?? false;
        $review = Review::create($data);
        return response()->json($review, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        return response()->json($review, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewsRequest $request, Review $review)
    {
        $this->authorize('update', $review);
        $review->update($request->validated());
        return response()->json($review, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $this->authorize('delete', $review);
        $review->delete();
        return response()->json(["message" => "Review deleted successfully"], 200);
    }
}