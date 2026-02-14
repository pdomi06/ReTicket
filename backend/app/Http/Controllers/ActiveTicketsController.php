<?php

namespace App\Http\Controllers;

use App\Models\active_tickets;
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
        $active_tickets = active_tickets::all();
        return response()->json($active_tickets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeactive_ticketsRequest $request)
    {
        $active_ticket = active_tickets::create($request->all());
        return response()->json($active_ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(active_tickets $active_ticket, $id)
    {
        $active_ticket = active_tickets::find($id);
        
        if (!$active_ticket) {
            return response()->json(["message" => "Active ticket not found"], 404);
        }
        
        return response()->json($active_ticket, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateactive_ticketsRequest $request, active_tickets $active_ticket, $id)
    {
        $active_ticket = active_tickets::find($id);
        
        if (!$active_ticket) {
            return response()->json(["message" => "Active ticket not found"], 404);
        }
        
        $active_ticket->update($request->all());
        return response()->json($active_ticket, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(active_tickets $active_ticket, $id)
    {
        $active_ticket = active_tickets::find($id);
        
        if (!$active_ticket) {
            return response()->json(["message" => "Active ticket not found"], 404);
        }
        
        $active_ticket->delete();
        return response()->json(["message" => "Active ticket deleted successfully"], 200);
    }
}