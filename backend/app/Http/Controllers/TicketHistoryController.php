<?php

namespace App\Http\Controllers;

use App\Models\TicketHistory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storeticket_historyRequest;
use App\Http\Requests\Updateticket_historyRequest;

class TicketHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ticket_histories = TicketHistory::all();
        return response()->json($ticket_histories, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeticket_historyRequest $request)
    {
        $ticket_history = TicketHistory::create($request->validated());
        return response()->json($ticket_history, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketHistory $ticketHistory)
    {
        return response()->json($ticketHistory, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateticket_historyRequest $request, TicketHistory $ticketHistory)
    {
        $ticketHistory->update($request->validated());
        return response()->json($ticketHistory, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketHistory $ticketHistory)
    {
        $ticketHistory->delete();
        return response()->json(["message" => "Ticket history deleted successfully"], 200);
    }
}