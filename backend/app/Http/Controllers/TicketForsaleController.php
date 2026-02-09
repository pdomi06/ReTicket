<?php

namespace App\Http\Controllers;

use App\Models\ticket_forsale;
use App\Http\Requests\Storeticket_forsaleRequest;
use App\Http\Requests\Updateticket_forsaleRequest;

class TicketForsaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets_forsale = ticket_forsale::all();
        return response()->json($tickets_forsale, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeticket_forsaleRequest $request)
    {
        $ticket_forsale = ticket_forsale::create($request->validated());
        return response()->json($ticket_forsale, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ticket_forsale $ticket_forsale)
    {
        return response()->json($ticket_forsale, 200);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Updateticket_forsaleRequest $request, ticket_forsale $ticket_forsale)
    {
        $ticket_forsale->update($request->validated());
        return response()->json($ticket_forsale, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ticket_forsale $ticket_forsale)
    {
        $ticket_forsale->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
