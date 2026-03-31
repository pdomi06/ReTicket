<?php

namespace App\Http\Controllers;

use App\Models\OriginalTicket;
use App\Models\TicketHistory;
use App\Models\TicketForSale;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketForSaleRequest;
use App\Http\Requests\UpdateTicketForSaleRequest;
use App\Http\Requests\SearchTicketForSaleRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TicketForSaleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'search']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', TicketForSale::class);
        $tickets_forsale = TicketForSale::all();
        return response()->json($tickets_forsale, 200);
    }

    public function search(SearchTicketForSaleRequest $request)
    {
        $this->authorize('viewAny', TicketForSale::class);
        $filters = $request->validated();
        $query = TicketForSale::query();

        if (array_key_exists('originalTicketId', $filters) && $filters['originalTicketId'] !== null) {
            $query->where('originalTicketId', $filters['originalTicketId']);
        }

        if (array_key_exists('fromUserId', $filters) && $filters['fromUserId'] !== null) {
            $query->where('fromUserId', $filters['fromUserId']);
        }

        if (array_key_exists('eventId', $filters) && $filters['eventId'] !== null) {
            $query->where('eventId', $filters['eventId']);
        }

        if (array_key_exists('price', $filters) && $filters['price'] !== null) {
            $query->where('price', $filters['price']);
        }

        if (array_key_exists('inBasket', $filters) && $filters['inBasket'] !== null) {
            $query->where('inBasket', $filters['inBasket']);
        }

        return response()->json(['success' => true, 'data' => $query->get()], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketForSaleRequest $request)
    {
        $this->authorize('create', TicketForSale::class);

        $data = $request->validated();
        $originalTicket = OriginalTicket::with('event')->findOrFail($data['originalTicketId']);

        if ((int) $originalTicket->eventId !== (int) $data['eventId']) {
            return response()->json([
                'success' => false,
                'message' => 'The selected original ticket does not belong to the selected event.',
            ], 422);
        }

        if ($originalTicket->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Only active original tickets can be listed for sale.',
            ], 422);
        }

        if (TicketForSale::where('originalTicketId', $originalTicket->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This ticket is already listed for sale.',
            ], 409);
        }

        $user = $request->user();
        if ($user->role !== 'admin') {
            $isEventOrganizer = $originalTicket->event !== null
                && (int) $originalTicket->event->organizer_id === (int) $user->id;

            $latestTransfer = TicketHistory::where('originalTicketId', $originalTicket->id)
                ->orderByDesc('id')
                ->first();

            $isCurrentOwner = $latestTransfer !== null
                && (int) $latestTransfer->toUserId === (int) $user->id;

            if (!$isEventOrganizer && !$isCurrentOwner) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not allowed to list this ticket for sale.',
                ], 403);
            }
        }

        $data['fromUserId'] = $request->user()->id;
        $data['inBasket'] = false;


        $ticket_forsale = TicketForSale::create($data);
        return response()->json($ticket_forsale, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketForSale $ticketForSale)
    {
        $this->authorize('view', $ticketForSale);
        return response()->json($ticketForSale, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketForSaleRequest $request, TicketForSale $ticketForSale)
    {
        $this->authorize('update', $ticketForSale);
        $ticketForSale->update($request->validated());
        return response()->json($ticketForSale, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketForSale $ticketForSale)
    {
        $this->authorize('delete', $ticketForSale);
        $ticketForSale->delete();
        return response()->json(["message" => "Ticket for sale deleted successfully"], 200);
    }

    public function basketChange(TicketForSale $ticketForSale)
    {
        $this->authorize('modifyBasket', $ticketForSale);
        $ticketForSale->inBasket = !$ticketForSale->inBasket;
        $ticketForSale->save();

        return response()->json($ticketForSale, 200);
    }

    public function addToBasket(TicketForSale $ticketForSale)
    {
        $this->authorize('modifyBasket', $ticketForSale);
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

    public function removeFromBasket(TicketForSale $ticketForSale)
    {
        $this->authorize('modifyBasket', $ticketForSale);
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