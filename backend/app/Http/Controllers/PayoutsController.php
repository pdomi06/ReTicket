<?php

namespace App\Http\Controllers;

use App\Models\payouts;
use App\Http\Requests\StorepayoutsRequest;
use App\Http\Requests\UpdatepayoutsRequest;

class PayoutsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payouts = payouts::all();
        return response()->json($payouts, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StorepayoutsRequest $request)
    {
        $payout = payouts::create($request->validated());
        return response()->json($payout, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(payouts $payouts)
    {
        return response()->json($payouts, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepayoutsRequest $request, payouts $payouts)
    {
        $payouts->update($request->validated());
        return response()->json($payouts, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(payouts $payouts)
    {
        $payouts->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
