<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Routing\Controller;
use App\Http\Requests\StoreEventsRequest;
use App\Http\Requests\UpdateEventsRequest;
use App\Http\Requests\SearchEventsRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
class EventsController extends Controller implements HasMiddleware
{
    /**
     * Display a listing of the resource.
     */

    public static function middleware(): array
    {
        return [
            'auth:sanctum' => ['except' => ['index', 'show', 'search']]
        ];
    }
    public function index(){
        $events = Event::with('originalTickets')
            ->orderByDesc('createdAt')
            ->paginate(20);

        $eventsData = $events->getCollection()->map(function($event) {
            return array_merge(
                $event->toArray(),
                ['firstTicketStatus' => $event->originalTickets->first()?->status ?? null]
            );
        });

        return response()->json(['success' => true,
            'data' => $eventsData,
            'pagination' => [
            'current_page' => $events->currentPage(),
            'total_results' => $events->total(),
            'total_pages' => $events->lastPage(),
            'per_page' => $events->perPage(),]], 200);
    }

     public function search(SearchEventsRequest $request)
    {
        $filters = $request->validated();

        $query = Event::query();
        
        
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
            'filters_applied' => $filters,
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