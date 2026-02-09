<?php

namespace App\Http\Controllers;

use App\Models\original_tickets;
use App\Http\Requests\Storeoriginal_ticketsRequest;
use App\Http\Requests\Updateoriginal_ticketsRequest;

class OriginalTicketsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $original_tickets = original_tickets::all();
        return response()->json($original_tickets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeoriginal_ticketsRequest $request)
    {
        $original_ticket = original_tickets::create($request->validated());
        return response()->json($original_ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(original_tickets $original_ticket)
    {
        return response()->json($original_ticket, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateoriginal_ticketsRequest $request, original_tickets $original_ticket)
    {
        $original_ticket->update($request->validated());
        return response()->json($original_ticket, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(original_tickets $original_ticket)
    {
        $original_ticket->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
