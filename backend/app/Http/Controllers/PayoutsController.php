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
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorepayoutsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(payouts $payouts)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(payouts $payouts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepayoutsRequest $request, payouts $payouts)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(payouts $payouts)
    {
        //
    }
}
