<?php

namespace App\Http\Controllers;

use App\Models\OriginalTicket;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storeoriginal_ticketsRequest;
use App\Http\Requests\Updateoriginal_ticketsRequest;

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeoriginal_ticketsRequest $request)
    {
        $original_ticket = OriginalTicket::create($request->all());
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
    public function update(Updateoriginal_ticketsRequest $request, OriginalTicket $originalTicket)
    {
        $originalTicket->update($request->all());
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
}