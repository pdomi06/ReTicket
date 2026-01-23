<?php

namespace App\Http\Controllers;

use App\Models\venue_map;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storevenue_mapRequest;
use App\Http\Requests\Updatevenue_mapRequest;

class VenueMapController extends Controller
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
    public function store(Storevenue_mapRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(venue_map $venue_map)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(venue_map $venue_map)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatevenue_mapRequest $request, venue_map $venue_map)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(venue_map $venue_map)
    {
        //
    }
}
