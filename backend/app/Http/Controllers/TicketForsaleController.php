<?php

namespace App\Http\Controllers;

use App\Models\TicketForSale;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketForsaleRequest;
use App\Http\Requests\UpdateTicketForsaleRequest;
use App\Http\Requests\SearchTicketForSale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function search(SearchTicketForSale $request)
    {
        $filters = $request->validated();
        $query = TicketForSale::query();

        if (!empty($filters['originalTicketId'])) {
            $query->where('originalTicketId', $filters['originalTicketId']);
        }

        if( !empty($filters['fromUserId'])) {
            $query->where('fromUserId', $filters['fromUserId']);
        }

        if (!empty($filters['eventId'])) {
            $query->where('eventId', $filters['eventId']);
        }

        if (!empty($filters['price'])) {
            $query->where('price', $filters['price']);
        }

        if (!empty($filters['inBasket'])) {
            $query->where('inBasket', $filters['inBasket']);
        }

        return response()->json(['success' => true, 'data' => $query->get()], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketForsaleRequest $request)
    {
        $ticket_forsale = TicketForSale::create(attributes: $request->validated());
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
    public function update(UpdateTicketForsaleRequest $request, TicketForSale $ticketForSale)
    {
        $ticketForSale->update($request->validated());
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

    public function basketChange(TicketForSale $ticketForSale)
    {
        $ticketForSale->inBasket = !$ticketForSale->inBasket;
        $ticketForSale->save();

        return response()->json($ticketForSale, 200);
    }

    public function addToBasket(Request $request, TicketForSale $ticketForSale)
    {
        $affected = DB::table('ticket_forsale')
            ->where('id', $ticketForSale->id)
            ->where('inBasket', false)
            ->update(['inBasket' => true]);

        if ($affected === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket is already in another basket.',
            ], 409);
        }

        $ticketForSale->refresh();
        return response()->json(['success' => true, 'data' => $ticketForSale], 200);
    }

    public function removeFromBasket(Request $request, TicketForSale $ticketForSale)
    {
        $affected = DB::table('ticket_forsale')
            ->where('id', $ticketForSale->id)
            ->where('inBasket', true)
            ->update(['inBasket' => false]);

        if ($affected === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket is not in a basket.',
            ], 409);
        }

        $ticketForSale->refresh();
        return response()->json(['success' => true, 'data' => $ticketForSale], 200);
    }
}