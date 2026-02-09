<?php

namespace App\Http\Controllers;

use App\Models\ticket_history;
use App\Http\Requests\Storeticket_historyRequest;
use App\Http\Requests\Updateticket_historyRequest;

class TicketHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ticket_histories = ticket_history::all();
        return response()->json($ticket_histories, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeticket_historyRequest $request)
    {
        $ticket_history = ticket_history::create($request->validated());
        return response()->json($ticket_history, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ticket_history $ticket_history)
    {
        return response()->json($ticket_history, 200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Updateticket_historyRequest $request, ticket_history $ticket_history)
    {
        $ticket_history->update($request->validated());
        return response()->json($ticket_history, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ticket_history $ticket_history)
    {
        $ticket_history->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
