<?php

namespace App\Http\Controllers;

use App\Models\OriginalTicket;
use App\Models\TicketForSale;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOriginalTicketsRequest;
use App\Http\Requests\UpdateOriginalTicketsRequest;
use App\Http\Requests\BulkStoreOriginalTicketsRequest;
use App\Http\Requests\SearchOriginalTicketsRequest;

class OriginalTicketsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $original_tickets = OriginalTicket::all();
        return response()->json($original_tickets, 200);
    }

    public function search(SearchOriginalTicketsRequest $request)
    {
        $filters = $request->validated();
        $query = OriginalTicket::query();

        if (!empty($filters['eventId'])) {
            $query->where('eventId', $filters['eventId']);
        }

        if (!empty($filters['section'])) {
            $query->where('section', 'like', '%' . $filters['section'] . '%');
        }

        if (!empty($filters['row'])) {
            $query->where('row', $filters['row']);
        }

        if (!empty($filters['seatNumber'])) {
            $query->where('seatNumber', $filters['seatNumber']);
        }

        if (array_key_exists('price', $filters) && $filters['price'] !== null) {
            $query->where('price', $filters['price']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['ticketPdfUrl'])) {
            $query->where('ticketPdfUrl', $filters['ticketPdfUrl']);
        }

        return response()->json(['success' => true, 'data' => $query->get()], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOriginalTicketsRequest $request)
    {
        $original_ticket = OriginalTicket::create($request->validated());
        return response()->json($original_ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OriginalTicket $originalTicket)
    {
        return response()->json($originalTicket, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOriginalTicketsRequest $request, OriginalTicket $originalTicket)
    {
        $originalTicket->update($request->validated());
        return response()->json($originalTicket, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OriginalTicket $originalTicket)
    {
        $originalTicket->delete();
        return response()->json(["message" => "Original ticket deleted successfully"], 200);
    }

    public function bulkStore(BulkStoreOriginalTicketsRequest $request)
    {
        $eventId = $request->eventId;
        $venues = $request->venue;
        $basePrice = $request->eventBasePrice;

        $originalTickets = [];
        foreach ($venues as $venue) {
            for ($i = 1; $i <= $venue['row']; $i++) {
                for ($j = 1; $j <= $venue['col']; $j++) {
                    $originalTickets[] = [
                        'eventId' => $eventId,
                        'section' => $venue['section'],
                        'row' => $i,
                        'seatNumber' => $j,
                        'price' => round($basePrice * $venue['rate'], 2),
                        'status' => 'pre-release',
                        'ticketPdfUrl' => "",
                        'createdAt' => now(),
                        'updatedAt' => now(),
                    ];
                }
            }
        }

        OriginalTicket::insert($originalTickets);
        return response()->json(["message" => "Original tickets created successfully"], 201);
    }
    public function getOnlyAvailableTicketsInForSale($eventId)
    {
        $ticketsForSale = TicketForSale::where('eventId', $eventId)
            ->where('inBasket', false)
            ->get();
        $availableOriginalTickets = OriginalTicket::where('eventId', $eventId)
            ->where('status', 'active')
            ->whereIn('id', $ticketsForSale->pluck('originalTicketId'))
            ->get();
        return response()->json([
            'success' => true,
            'data' => $availableOriginalTickets,
        ], 200);
    }
}
