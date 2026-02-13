<?php

namespace App\Http\Controllers;

use App\Models\events;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreeventsRequest;
use App\Http\Requests\UpdateeventsRequest;

class EventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = events::all();
        return response()->json($events, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreeventsRequest $request)
    {
        $event = events::create($request->all());
        return response()->json($event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(events $event, $id)
    {
        $event = events::find($id);
        
        if (!$event) {
            return response()->json(["message" => "Event not found"], 404);
        }
        
        return response()->json($event, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateeventsRequest $request, events $event, $id)
    {
        $event = events::find($id);
        
        if (!$event) {
            return response()->json(["message" => "Event not found"], 404);
        }
        
        $event->update($request->all());
        return response()->json($event, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(events $event, $id)
    {
        $event = events::find($id);
        
        if (!$event) {
            return response()->json(["message" => "Event not found"], 404);
        }
        
        $event->delete();
        return response()->json(["message" => "Event deleted successfully"], 200);
    }
}