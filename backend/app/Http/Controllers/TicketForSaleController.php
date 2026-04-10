<?php

namespace App\Http\Controllers;

use App\Models\OriginalTicket;
use App\Models\TicketForSale;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketForSaleRequest;
use App\Http\Requests\UpdateTicketForSaleRequest;
use App\Http\Requests\SearchTicketForSaleRequest;
use App\Http\Requests\CheckOutTicketForSaleRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;

class TicketForSaleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'search', 'show', 'checkOut', 'basketChange', 'addToBasket', 'removeFromBasket']),
        ];
    }

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
        $data['fromUserId'] = $user->id;

        $data['inBasket'] = false;


        $ticket_forsale = TicketForSale::create($data);
        return response()->json($ticket_forsale, 201);
    }

    public function show(TicketForSale $ticketForSale)
    {
        $this->authorize('view', $ticketForSale);
        return response()->json($ticketForSale, 200);
    }

    public function update(UpdateTicketForSaleRequest $request, TicketForSale $ticketForSale)
    {
        $this->authorize('update', $ticketForSale);
        $ticketForSale->update($request->validated());
        return response()->json($ticketForSale, 200);
    }

    public function destroy(TicketForSale $ticketForSale)
    {
        $this->authorize('delete', $ticketForSale);
        $ticketForSale->delete();
        return response()->json(["message" => "Ticket for sale deleted successfully"], 200);
    }

    public function basketChange(TicketForSale $ticketForSale)
    {
        if (auth()->check() && auth()->id() === $ticketForSale->fromUserId) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot modify your own listed ticket basket state.',
            ], 403);
        }

        $ticketForSale->inBasket = !$ticketForSale->inBasket;
        $ticketForSale->save();

        return response()->json($ticketForSale, 200);
    }

    public function addToBasket(TicketForSale $ticketForSale)
    {
        if (auth()->check() && auth()->id() === $ticketForSale->fromUserId) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot add your own listed ticket to basket.',
            ], 403);
        }

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
        if (auth()->check() && auth()->id() === $ticketForSale->fromUserId) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot remove your own listed ticket from basket.',
            ], 403);
        }

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

    public function checkOut(CheckOutTicketForSaleRequest $request)
    {
        $email = $request->validated()['email'];
        $paymentIntentId = $request->validated()['paymentIntentId'];
        $ticketIds = $request->validated()['tickets'];

        if (!is_string($paymentIntentId) || $paymentIntentId === '') {
            return response()->json([
                'success' => false,
                'message' => 'Payment reference is required.',
            ], 422);
        }

        foreach ($ticketIds as $ticketId) {
            $ticketForSale = TicketForSale::find($ticketId);
            $ticketListingId = $this->generateUniqueTicketListingId();

            DB::transaction(function () use ($ticketForSale, $ticketListingId, $email) {
                $platformFee = round($ticketForSale->price * 0.1, 2);
                DB::table('ticket_history')->insert([
                    'originalTicketId' => $ticketForSale->originalTicketId,
                    'ticketListingId' => $ticketListingId,
                    'fromUserId' => $ticketForSale->fromUserId,
                    'toUser' => $email,
                    'price' => $ticketForSale->price,
                    'platformFee' => $platformFee,
                ]);
                DB::table('active_tickets')->insert([
                    'originalTicketId' => $ticketForSale->originalTicketId,
                    'ticketListingId' => $ticketListingId,
                ]);
                $ticketForSale->delete();
            });
        }

        return response()->json(['success' => true, 'message' => 'Ticket(s) marked as sold and history recorded.'], 200);
    }

    private function generateUniqueTicketListingId(): string
    {
        do {
            $ticketListingId = Str::ulid()->toString();
        } while (DB::table('active_tickets')->where('ticketListingId', $ticketListingId)->exists());

        return $ticketListingId;
    }
}
