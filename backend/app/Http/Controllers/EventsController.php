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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class EventsController extends Controller implements HasMiddleware
{
    private const SEARCH_LIMIT = 20;

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
<<<<<<< HEAD
<<<<<<< HEAD
            ->paginate(self::SEARCH_LIMIT);
=======
            ->paginate(self::PAGINATE);
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")
=======
            ->paginate(self::PAGINATE);
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")

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
        $limit = (int) ($filters['limit'] ?? self::SEARCH_LIMIT);
        $cursor = isset($filters['cursor']) ? trim((string) $filters['cursor']) : null;
        $nowTimestamp = now()->timestamp;
        $normalizedNameExpression = 'LOWER(TRIM(name))';

        $baseQuery = Event::query();
        $this->applySearchFilters($baseQuery, $filters);

        $groupKeys = (clone $baseQuery)
            ->selectRaw("{$normalizedNameExpression} as group_key")
            ->when(
                !empty($cursor),
                fn (Builder $query) => $query->whereRaw("{$normalizedNameExpression} > ?", [$cursor])
            )
            ->groupBy(DB::raw($normalizedNameExpression))
            ->orderByRaw("{$normalizedNameExpression} asc")
            ->limit($limit + 1)
            ->pluck('group_key')
            ->map(fn ($groupKey) => (string) $groupKey)
            ->all();

        $hasMore = count($groupKeys) > $limit;
        $pageGroupKeys = $hasMore ? array_slice($groupKeys, 0, $limit) : $groupKeys;
        $nextCursor = $hasMore && !empty($pageGroupKeys)
            ? $pageGroupKeys[count($pageGroupKeys) - 1]
            : null;

        $groupedData = [];

        if (!empty($pageGroupKeys)) {
            $occurrences = (clone $baseQuery)
                ->whereIn(DB::raw($normalizedNameExpression), $pageGroupKeys)
                ->orderByRaw("{$normalizedNameExpression} asc")
                ->orderBy('eventDate')
                ->orderBy('id')
                ->get();

            $occurrencesByGroup = [];

            foreach ($occurrences as $occurrence) {
                $groupKey = strtolower(trim($occurrence->name));
                $occurrencesByGroup[$groupKey][] = $occurrence;
            }

            foreach ($pageGroupKeys as $groupKey) {
                $groupOccurrences = $occurrencesByGroup[$groupKey] ?? [];

                if (empty($groupOccurrences)) {
                    continue;
                }

                $representative = collect($groupOccurrences)->first(
                    fn (Event $event) => $event->eventDate >= $nowTimestamp
                ) ?? $groupOccurrences[0];

                $groupedData[] = array_merge(
                    $representative->toArray(),
                    [
                        'occurrenceCount' => count($groupOccurrences),
                        'occurrences' => array_map(
                            fn (Event $event) => $event->toArray(),
                            $groupOccurrences
                        ),
                    ]
                );
            }
        }

        $totalGroups = DB::query()
            ->fromSub(
                (clone $baseQuery)
                    ->selectRaw("{$normalizedNameExpression} as group_key")
                    ->groupBy(DB::raw($normalizedNameExpression)),
                'grouped_events'
            )
            ->count();

        $filtersForResponse = $filters;
        unset($filtersForResponse['cursor'], $filtersForResponse['limit']);

        return response()->json([
            'success' => true,
            'data' => $groupedData,
            'filters_applied' => $filtersForResponse,
            'pagination' => [
                'limit' => $limit,
                'returned_count' => count($groupedData),
                'has_more' => $hasMore,
                'next_cursor' => $nextCursor,
                'total_groups' => $totalGroups,
            ]
        ], 200);
    }

    private function applySearchFilters(Builder $query, array $filters): void
    {
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