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
        $venue_maps = venue_map::all();
        return response()->json($venue_maps, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storevenue_mapRequest $request)
    {
        $venue_map = venue_map::create($request->validated());
        return response()->json($venue_map, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(venue_map $venue_map)
    {
        return response()->json($venue_map, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Updatevenue_mapRequest $request, venue_map $venue_map)
    {
        $venue_map->update($request->validated());
        return response()->json($venue_map, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(venue_map $venue_map)
    {
        $venue_map->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
