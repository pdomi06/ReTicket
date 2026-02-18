<?php

namespace App\Http\Controllers;

use App\Models\TicketForSale;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storeticket_forsaleRequest;
use App\Http\Requests\Updateticket_forsaleRequest;

class TicketForsaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets_forsale = TicketForSale::all();
        return response()->json($tickets_forsale, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeticket_forsaleRequest $request)
    {
        $ticket_forsale = TicketForSale::create($request->all());
        return response()->json($ticket_forsale, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketForSale $ticketForSale)
    {
        return response()->json($ticketForSale, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateticket_forsaleRequest $request, TicketForSale $ticketForSale)
    {
        $ticketForSale->update($request->all());
        return response()->json($ticketForSale, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketForSale $ticketForSale)
    {
        $ticketForSale->delete();
        return response()->json(["message" => "Ticket for sale deleted successfully"], 200);
    }
}