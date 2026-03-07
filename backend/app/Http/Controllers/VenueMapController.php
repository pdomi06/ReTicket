<?php

namespace App\Http\Controllers;

use App\Models\VenueMap;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVenueMapRequest;
use App\Http\Requests\UpdateVenueMapRequest;
use App\Http\Requests\SearchVenueMapRequest;
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
     public function search(SearchVenueMapRequest $request)
    {
        $filters = $request->validated();
        $query = VenueMap::search($filters);
        return response()->json(['success' => true, 'data' => $query->get()], 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVenueMapRequest $request)
    {
        $venue_map = VenueMap::create($request->validated());
        return response()->json($venue_map, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(VenueMap $venue)
    {
        return response()->json($venue, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVenueMapRequest $request, VenueMap $venue)
    {
        $venue->update($request->validated());
        return response()->json($venue, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VenueMap $venue)
    {
        $venue->delete();
        return response()->json(["message" => "Venue map deleted successfully"], 200);
    }
}