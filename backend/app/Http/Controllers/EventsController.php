<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventsRequest;
use App\Http\Requests\UpdateEventsRequest;
use App\Http\Requests\SearchEventsRequest;

class EventsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(){
        $events = Event::orderByDesc('createdAt')->paginate(20);

        return response()->json(['success' => true,
            'data' => $events->items(),
            'pagination' => [
            'current_page' => $events->currentPage(),
            'total_results' => $events->total(),
            'total_pages' => $events->lastPage(),
            'per_page' => $events->perPage(),]], 200);
    }

     public function search(SearchEventsRequest $request)
    {
        $filters = $request->validated();
        
        // Debug: Log the filters to see what we're getting
        \Log::info('Search filters:', $filters);
        \Log::info('All request data:', $request->all());

        $query = Event::query();
        
        // Apply filters manually to ensure they work
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }
        
        if (!empty($filters['country'])) {
            $query->where('country', 'like', '%' . $filters['country'] . '%');
        }
        
        if (!empty($filters['venue'])) {
            $query->where('venue', 'like', '%' . $filters['venue'] . '%');
        }
        
        if (!empty($filters['city'])) {
            $query->where('city', 'like', '%' . $filters['city'] . '%');
        }
        
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }
        
        if (!empty($filters['eventDate'])) {
            $query->whereDate('eventDate', '=', $filters['eventDate']);
        }
        
        if (!empty($filters['maxPrice'])) {
            $query->where('basePrice', '<=', $filters['maxPrice']);
        }

        $events = $query->orderByDesc('createdAt')->paginate(20);

        return response()->json(['success' => true,
            'data' => $events->items(),
            'filters_applied' => $filters, // Debug: include filters in response
            'pagination' => [
            'current_page' => $events->currentPage(),
            'total_results' => $events->total(),
            'total_pages' => $events->lastPage(),
            'per_page' => $events->perPage(),]], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventsRequest $request)
    {
        $event = Event::create($request->validated());

        return response()->json(['success' => true, 'data' => $event], 201);
    }

    /**
     * Display the specified resource.
     */
     public function show(Event $event)
    {
        return response()->json(['success' => true, 'data' => $event], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventsRequest $request, Event $event)
    {
        $event->update($request->validated());

        return response()->json(['success' => true, 'data' => $event], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json(['success' => true, 'message' => 'Event deleted successfully'], 200);
    }
}