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
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeticket_historyRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ticket_history $ticket_history)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ticket_history $ticket_history)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateticket_historyRequest $request, ticket_history $ticket_history)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ticket_history $ticket_history)
    {
        //
    }
}
