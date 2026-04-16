<?php

namespace App\Http\Controllers;

use App\Models\ActiveTicket;
use App\Models\OriginalTicket;
use App\Models\TicketForSale;
use App\Models\TicketHistory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActiveTicketsRequest;
use App\Http\Requests\ResellActiveTicketRequest;
use App\Http\Requests\UpdateActiveTicketsRequest;
use App\Http\Requests\ValidateActiveTicketRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ActiveTicketsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show', 'checkTicket']),
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

    /**
     * Validate an active ticket.
     */
    public function validateTicket(ValidateActiveTicketRequest $request)
    {
        $data = $request->validated();

        $activeTicket = ActiveTicket::where('ticketListingId', $data['ticketListingId'])->first();

        if (!$activeTicket) {
            $history = TicketHistory::where('ticketListingId', $data['ticketListingId'])->first();
            if ($history) {
                return response()->json([
                    'success' => false,
                    'error' => 'This ticket was sold to ' . $history->toUser . '.',
                ], 409);
            }
            return response()->json([
                'success' => false,
                'error' => 'Ticket was not found.',
            ], 404);
        }

        $this->authorize('validateTicket', $activeTicket);

        if ($activeTicket->isValidated) {
            $history = TicketHistory::where('ticketListingId', $data['ticketListingId'])->first();
            return response()->json([
                'success' => false,
                'error' => 'This ticket has already been validated at ' . $activeTicket->validatedAt . '.' . ($history ? ' Last sold to ' . $history->toUser . '.' : ''),
            ], 409);
        }
        
        $originalTicket = $activeTicket->originalTicket;
        if($originalTicket->eventId !== $data['eventId']){
            return response()->json([
                'success' => false,
                'error' => 'This ticket does not belong to this event.',
            ], 409);
        }
        if($originalTicket->status === 'expired'){
            return response()->json([
                'success' => false,
                'error' => 'This ticket is expired and cannot be validated.',
            ], 409);
        }
        if($originalTicket->status === 'cancelled'){
            return response()->json([
                'success' => false,
                'error' => 'This ticket is cancelled and cannot be validated.',
            ], 409);
        }

        $activeTicket->isValidated = true;
        $activeTicket->validatedAt = now();
        $activeTicket->save();

        return response()->json([
            'success' => true,
            'message' => 'Ticket validated successfully.',
            'originalTicket' => $originalTicket,
        ], 200);
    }
    public function checkTicket(Request $request)
    {
        
        $activeTicket = ActiveTicket::where('ticketListingId', $request->ticketListingId)->first();

        if (!$activeTicket) {
            return response()->json([
                'exists' => false,
                'message' => 'Ticket is not active.',
            ], 200);
        }
        $originalTicket = OriginalTicket::join('events', 'original_tickets.eventId', '=', 'events.id')
            ->select([
                'original_tickets.id',
                'events.name as eventName',
                'events.eventDate',
                'events.venue',
                'original_tickets.section',
                'original_tickets.row',
                'original_tickets.seatNumber',
                'original_tickets.price',
                'original_tickets.status',
            ])
            ->where('original_tickets.id', $activeTicket->originalTicketId)
            ->first();

        return response()->json([
            'exists' => true,
            'message' => 'Ticket is active.',
            'originalTicket' => $originalTicket,
            'averagePrice' => TicketForSale::query()->where('eventId', $activeTicket->originalTicket->eventId)->avg('price'),
        ], 200);
    }
    public function resellTicket(ResellActiveTicketRequest $request)
    {
        $data = $request->validated();
        $activeTicket = ActiveTicket::where('ticketListingId', $data['ticketListingId'])->first();
        $price = round((float) $data['price'], 2);

        if (!$activeTicket) {
            return response()->json([
                'success' => false,
                'error' => 'Ticket was not found.',
            ], 404);
        }
        
        $this->authorize('resell', $activeTicket);

        if ($activeTicket->isValidated) {
            return response()->json([
                'success' => false,
                'error' => 'This ticket has already been validated and cannot be resold.',
            ], 409);
        }

        $originalTicket = OriginalTicket::find($activeTicket->originalTicketId);
        if (!$originalTicket || !$originalTicket->event) {
            return response()->json([
                'success' => false,
                'error' => 'Ticket details could not be resolved for resale.',
            ], 404);
        }

        if ($originalTicket->status !== 'active') {
            return response()->json([
                'success' => false,
                'error' => 'This ticket is not valid and cannot be resold.',
            ], 409);
        }

        if ((int) $originalTicket->event->eventDate < now()->timestamp) {
            return response()->json([
                'success' => false,
                'error' => 'This ticket is no longer valid and cannot be resold.',
            ], 409);
        }

        $ticketForSale = TicketForSale::create([
            'originalTicketId' => $activeTicket->originalTicketId,
            'fromUserId' => request()->user()->id,
            'eventId' => $activeTicket->originalTicket->eventId,
            'price' => $price,
            'isResell' => true,
            'inBasket' => false,
        ]);

        $activeTicket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket listed for resale successfully.',
            'ticketForSale' => $ticketForSale,
        ], 200);
    }
}