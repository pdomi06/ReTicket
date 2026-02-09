<?php

namespace App\Http\Controllers;

use App\Models\reviews;
use App\Http\Requests\StorereviewsRequest;
use App\Http\Requests\UpdatereviewsRequest;

class ReviewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = reviews::all();
        return response()->json($reviews, 200);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StorereviewsRequest $request)
    {
        $review = reviews::create($request->validated());
        return response()->json($review, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(reviews $review)
    {
        return response()->json($review, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatereviewsRequest $request, reviews $review)
    {
        $review->update($request->validated());
        return response()->json($review, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(reviews $reviews)
    {
        $reviews->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
