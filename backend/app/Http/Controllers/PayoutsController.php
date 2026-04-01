<?php

namespace App\Http\Controllers;

use App\Models\Payout;
use App\Http\Controllers\Controller;
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
        $this->authorize('viewAny', Payout::class);
        $payouts = Payout::all();
        return response()->json($payouts, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payout $payout)
    {
        $this->authorize('view', $payout);
        return response()->json($payout, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayoutsRequest $request, Payout $payout)
    {
        $this->authorize('update', $payout);
        $payout->update($request->validated());
        return response()->json($payout, 200);
    }
    
    public function myPayouts(){
        $user = auth()->user();
        $payouts = Payout::where('vendorId', $user->id)->get();
        return response()->json($payouts, 200);
    }
}