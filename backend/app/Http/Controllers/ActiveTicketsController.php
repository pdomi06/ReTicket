<?php

namespace App\Http\Controllers;

use App\Models\ActiveTicket;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActiveTicketsRequest;
use App\Http\Requests\UpdateActiveTicketsRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ActiveTicketsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', ActiveTicket::class);
        $active_tickets = ActiveTicket::all();
        return response()->json($active_tickets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActiveTicketsRequest $request)
    {
        $this->authorize('create', ActiveTicket::class);
        $active_ticket = ActiveTicket::create($request->validated());
        return response()->json($active_ticket, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ActiveTicket $activeTicket)
    {
        $this->authorize('view', $activeTicket);
        return response()->json($activeTicket, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActiveTicketsRequest $request, ActiveTicket $activeTicket)
    {
        $this->authorize('update', $activeTicket);
        $activeTicket->update($request->validated());
        return response()->json($activeTicket, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActiveTicket $activeTicket)
    {
        $this->authorize('delete', $activeTicket);
        $activeTicket->delete();
        return response()->json(["message" => "Active ticket deleted successfully"], 200);
    }
}