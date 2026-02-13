<?php

namespace App\Http\Controllers;

use App\Models\payouts;
use App\Http\Controllers\Controller;
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
        $payout = payouts::create($request->all());
        return response()->json($payout, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(payouts $payouts, $id)
    {
        $payout = payouts::find($id);
        
        if (!$payout) {
            return response()->json(["message" => "Payout not found"], 404);
        }
        
        return response()->json($payout, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepayoutsRequest $request, payouts $payouts, $id)
    {
        $payout = payouts::find($id);
        
        if (!$payout) {
            return response()->json(["message" => "Payout not found"], 404);
        }
        
        $payout->update($request->all());
        return response()->json($payout, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(payouts $payouts, $id)
    {
        $payout = payouts::find($id);
        
        if (!$payout) {
            return response()->json(["message" => "Payout not found"], 404);
        }
        
        $payout->delete();
        return response()->json(["message" => "Payout deleted successfully"], 200);
    }
}