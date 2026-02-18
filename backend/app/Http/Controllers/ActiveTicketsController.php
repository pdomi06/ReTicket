<?php

namespace App\Http\Controllers;

use App\Models\ActiveTicket;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storeactive_ticketsRequest;
use App\Http\Requests\Updateactive_ticketsRequest;

class ActiveTicketsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $active_tickets = ActiveTicket::all();
        return response()->json($active_tickets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeactive_ticketsRequest $request)
    {
        $active_ticket = ActiveTicket::create($request->validated());
        return response()->json($active_ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ActiveTicket $activeTicket)
    {
        return response()->json($activeTicket, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateactive_ticketsRequest $request, ActiveTicket $activeTicket)
    {
        $activeTicket->update($request->validated());
        return response()->json($activeTicket, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActiveTicket $activeTicket)
    {
        $activeTicket->delete();
        return response()->json(["message" => "Active ticket deleted successfully"], 200);
    }
}