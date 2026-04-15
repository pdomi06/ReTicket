<?php

namespace App\Http\Controllers;

use App\Models\TicketHistory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketHistoryRequest;
use App\Http\Requests\UpdateTicketHistoryRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TicketHistoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware('verified'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', TicketHistory::class);
        $ticket_histories = TicketHistory::all();
        return response()->json($ticket_histories, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketHistoryRequest $request)
    {
        $this->authorize('create', TicketHistory::class);
        TicketHistory::create($request->validated());
        return response()->json(["message" => "Ticket history created successfully"], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketHistory $ticketHistory)
    {
        $this->authorize('view', $ticketHistory);
        return response()->json($ticketHistory, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketHistoryRequest $request, TicketHistory $ticketHistory)
    {
        $this->authorize('update', $ticketHistory);
        $ticketHistory->update($request->validated());
        return response()->json($ticketHistory, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketHistory $ticketHistory)
    {
        $this->authorize('delete', $ticketHistory);
        $ticketHistory->delete();
        return response()->json(["message" => "Ticket history deleted successfully"], 200);
    }
    public function myHistory(Request $request)
    {
        $user = $request->user();
        $ticket_histories = TicketHistory::join('original_tickets', 'ticket_history.originalTicketId', '=', 'original_tickets.id')
        ->join('events', 'original_tickets.eventId', '=', 'events.id')
        ->where('ticket_history.fromUserId', $user->id)
        ->where('ticket_history.isResell', true)
        ->select(
            'events.name as eventName',
            'events.eventDate as eventDate',
            'events.venue as venue',
            'original_tickets.section as section',
            'original_tickets.row as row',
            'original_tickets.seatNumber as seat',
            'ticket_history.price as salePrice',
            'ticket_history.platformFee as platformFee'
            )
        ->get();
        $salesSummary = [
            'balance' => User::where('id', $user->id)->value('balance'),
            'totalEarned' => $ticket_histories->sum('salePrice') - $ticket_histories->sum('platformFee'),
            ];
        return response()->json(['salesSummary' => $salesSummary, 'history' => $ticket_histories], 200);
    }
}