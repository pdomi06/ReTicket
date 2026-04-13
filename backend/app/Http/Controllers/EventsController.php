<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventsRequest;
use App\Http\Requests\UpdateEventsRequest;
use App\Http\Requests\SearchEventsRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;

class EventsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show', 'search', 'landing']),
        ];
    }

    public function landing()
    {
        $nowTimestamp = now()->timestamp;
        $in12HoursTimestamp = now()->addHours(12)->timestamp;

        $mostPopularEvents = Event::query()
            ->where('eventDate', '>=', $nowTimestamp)
            ->orderByDesc('views')
            ->orderBy('eventDate')
            ->limit(8)
            ->get();

        $lastMinuteDeals = Event::query()
            ->where('eventDate', '>=', $in12HoursTimestamp)
            ->orderBy('basePrice')
            ->orderBy('eventDate')
            ->limit(4)
            ->get();

        $events = Event::query()
            ->where('eventDate', '>=', $nowTimestamp)
            ->orderBy('eventDate')
            ->get();

        $upcomingEvents = [];

        foreach ($events as $event) {
            if ($event->originalTickets()->where('status', 'pre-release')->exists()) {
                $upcomingEvents[] = $event;
            }
        }

        $upcomingEvents = collect($upcomingEvents)
            ->sortBy('eventDate')
            ->take(6)
            ->values();
        $featuredEvents = Event::query()
            ->where('isFeatured', true)
            ->where('eventDate', '>=', $nowTimestamp)
            ->orderByDesc('views')
            ->orderBy('eventDate')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'mostPopularEvents' => $mostPopularEvents,
                'lastMinuteDeals' => $lastMinuteDeals,
                'upcomingEvents' => $upcomingEvents,
                'featuredEvents' => $featuredEvents,
            ],
        ], 200);
    }

    public function index()
    {
        $events = Event::with('originalTickets')
            ->orderByDesc('created_at')
            ->paginate(20);

        $eventsData = $events->getCollection()->map(function ($event) {
            return array_merge(
                $event->toArray(),
                ['firstTicketStatus' => $event->originalTickets->first()?->status ?? null]
            );
        });

        return response()->json([
            'success' => true,
            'data' => $eventsData,
            'pagination' => [
                'current_page' => $events->currentPage(),
                'total_results' => $events->total(),
                'total_pages' => $events->lastPage(),
                'per_page' => $events->perPage(),
            ]
        ], 200);
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
            // Parse date in user's timezone, then convert to UTC for database query
            $userTimezone = $filters['timezone'] ?? '+00:00';
            $date = Carbon::createFromFormat('Y-m-d', $filters['eventDate'], $userTimezone);
            
            $startOfDayTimestamp = $date->copy()->startOfDay()->timestamp;
            $endOfDayTimestamp = $date->copy()->endOfDay()->timestamp;
            $query->whereBetween('eventDate', [$startOfDayTimestamp, $endOfDayTimestamp]);
        }

        if (!empty($filters['maxPrice'])) {
            $query->where('basePrice', '<=', $filters['maxPrice']);
        }

        $events = $query->orderByDesc('created_at')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $events->items(),
            'filters_applied' => $filters,
            'pagination' => [
            'current_page' => $events->currentPage(),
            'total_results' => $events->total(),
            'total_pages' => $events->lastPage(),
            'per_page' => $events->perPage(),
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventsRequest $request)
    {
        $data = $request->validated();
        $data['createdBy'] = auth()->id();
        $event = Event::create($data);
        return response()->json(['success' => true, 'data' => $event], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Event $event)
    {
        $viewerKey = auth()->check()
            ? 'u:' . auth()->id()
            : 'g:' . sha1(($request->ip() ?? 'noip') . '|' . ($request->userAgent() ?? 'noua'));

        $cacheKey = "event:viewed:{$event->id}:{$viewerKey}";

        // One view per visitor per event in 6-hour windows.
        if (Cache::add($cacheKey, true, now()->addHours(6))) {
            Event::whereKey($event->id)->increment('views');
            $event->refresh();
        }

        return response()->json(['success' => true, 'data' => $event], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventsRequest $request, Event $event)
    {
        $this->authorize('update', $event);
        $event->update($request->validated());

        return response()->json(['success' => true, 'data' => $event], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);
        $event->delete();

        return response()->json(['success' => true, 'message' => 'Event deleted successfully'], 200);
    }
}