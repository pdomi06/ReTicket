<?php

namespace App\Http\Controllers;

use App\Models\Payout;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePayoutsRequest;
use App\Http\Requests\UpdatePayoutsRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PayoutsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payouts = Payout::all();
        return response()->json($payouts, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePayoutsRequest $request)
    {
        $payout = Payout::create($request->validated());
        return response()->json($payout, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payout $payout)
    {
        return response()->json($payout, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayoutsRequest $request, Payout $payout)
    {
        $payout->update($request->validated());
        return response()->json($payout, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payout $payout)
    {
        $payout->delete();
        return response()->json(["message" => "Payout deleted successfully"], 200);
    }
}