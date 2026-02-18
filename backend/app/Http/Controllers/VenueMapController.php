<?php

namespace App\Http\Controllers;

use App\Models\VenueMap; // Make sure this matches your model name
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
        $venue_maps = VenueMap::all();
        return response()->json($venue_maps, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storevenue_mapRequest $request)
    {
        $venue_map = VenueMap::create($request->all());
        return response()->json($venue_map, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(VenueMap $venue) // Parameter MUST match route {venue}
    {
        return response()->json($venue, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatevenue_mapRequest $request, VenueMap $venue) // Parameter MUST match route {venue}
    {
        $venue->update($request->all());
        return response()->json($venue, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VenueMap $venue) // Parameter MUST match route {venue}
    {
        $venue->delete();
        return response()->json(["message" => "Venue map deleted successfully"], 200);
    }
}