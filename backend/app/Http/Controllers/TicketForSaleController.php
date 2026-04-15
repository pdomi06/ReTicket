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
use Illuminate\Http\Request;

class TicketForSaleController extends Controller implements HasMiddleware
{
    private const RESERVATION_TTL_MINUTES = 30;

    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'search', 'show', 'checkOut', 'finalize', 'addToBasket', 'removeFromBasket', 'refreshBasket', 'verifyBasket']),
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
            $inBasketFilter = filter_var($filters['inBasket'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);

            if ($inBasketFilter === false) {
                $query->where(function ($q) {
                    $q->where('inBasket', false)
                        ->orWhere(function ($inner) {
                            $inner->where('inBasket', true)
                                ->where(function ($expires) {
                                    $expires->where('reservation_expires_at', '<=', now())
                                        ->orWhereNull('reservation_expires_at');
                                });
                        });
                });
            } else {
                $query->where('inBasket', true);
            }
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

    public function addToBasket(Request $request, $id)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['message' => 'Missing basket token.'], 422);
        }

        $now = now();
        $expiry = $now->copy()->addMinutes(self::RESERVATION_TTL_MINUTES);

        return DB::transaction(function () use ($id, $incomingToken, $now, $expiry) {
            $ticket = TicketForSale::whereKey($id)->lockForUpdate()->firstOrFail();

            // Conflict check: ticket is held by a DIFFERENT token that hasn't expired
            if ($ticket->hasActiveReservation() && $ticket->basket_token !== $incomingToken) {
                return response()->json(['message' => 'Ticket is already reserved by another session.'], 409);
            }

            $ticket->update([
                'inBasket' => true,
                'basket_token' => $incomingToken,
                'reservation_started_at' => $now,
                'reservation_expires_at' => $expiry,
            ]);

            // Reset timer for this token's active cart items on every add interaction.
            TicketForSale::where('basket_token', $incomingToken)
                ->where('inBasket', true)
                ->where(function ($q) use ($ticket, $now) {
                    $q->where('id', $ticket->id)
                        ->orWhere('reservation_expires_at', '>', $now);
                })
                ->update([
                    'reservation_started_at' => $now,
                    'reservation_expires_at' => $expiry,
                ]);

            return response()->json([
                'message' => 'Ticket added to basket.',
                'basketExpiresAt' => $expiry->toIso8601String(),
                'ticket' => $ticket->fresh(),
            ]);
        });
    }

    public function removeFromBasket(Request $request, $id)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['message' => 'Missing basket token.'], 422);
        }

        $now = now();

        return DB::transaction(function () use ($id, $incomingToken, $now) {
            $ticket = TicketForSale::whereKey($id)->lockForUpdate()->firstOrFail();

            // Allow removal only by the owner or if the hold has already expired
            if ($ticket->inBasket && $ticket->basket_token !== $incomingToken && $ticket->hasActiveReservation()) {
                return response()->json(['message' => 'You do not own this reservation.'], 403);
            }

            $ticket->update([
                'inBasket' => false,
                'basket_token' => null,
                'reservation_started_at' => null,
                'reservation_expires_at' => null,
            ]);

            // Reset timer for the owner's REMAINING cart items
            if ($incomingToken) {
                $newExpiry = $now->copy()->addMinutes(self::RESERVATION_TTL_MINUTES);
                TicketForSale::where('basket_token', $incomingToken)
                    ->where('inBasket', true)
                    ->where('reservation_expires_at', '>', $now)
                    ->update([
                        'reservation_started_at' => $now,
                        'reservation_expires_at' => $newExpiry,
                    ]);
            }

            return response()->json(['message' => 'Ticket removed from basket.']);
        });
    }

    /**
     * Resets the 30-minute TTL for every ticket held by the given basket token.
     * Called periodically by the frontend while the cart has items.
     */
    public function refreshBasket(Request $request)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['message' => 'Missing basket token.'], 422);
        }

        $now = now();
        $newExpiry = $now->copy()->addMinutes(self::RESERVATION_TTL_MINUTES);

        $updated = TicketForSale::where('basket_token', $incomingToken)
            ->where('inBasket', true)
            ->where('reservation_expires_at', '>', $now)
            ->update([
                'reservation_started_at' => $now,
                'reservation_expires_at' => $newExpiry,
            ]);

        return response()->json([
            'refreshed' => $updated,
            'basketExpiresAt' => $updated > 0 ? $newExpiry->toIso8601String() : null,
        ]);
    }

    /**
     * Returns the current server-side expiry for every ticket held by this token.
     * Called by CartContext on mount to verify localStorage state against the server.
     */
    public function verifyBasket(Request $request)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['tickets' => [], 'basketExpiresAt' => null]);
        }

        $tickets = TicketForSale::where('basket_token', $incomingToken)
            ->where('inBasket', true)
            ->where('reservation_expires_at', '>', now())
            ->get(['id', 'reservation_expires_at']);

        $minExpiry = $tickets->min('reservation_expires_at');

        return response()->json([
            'tickets' => $tickets,
            'basketExpiresAt' => $minExpiry ? \Carbon\Carbon::parse($minExpiry)->toIso8601String() : null,
        ]);
    }

    public function checkOut(CheckOutTicketForSaleRequest $request)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['message' => 'Missing or invalid basket token.'], 422);
        }

        $email = $request->validated()['email'];
        $orderId = $request->validated()['orderId'];
        $ticketIds = $request->validated()['tickets'];

        foreach ($ticketIds as $ticketId) {
            $ticketForSale = TicketForSale::find($ticketId);

            if (! $ticketForSale) {
                return response()->json(['message' => "Ticket {$ticketId} not found."], 404);
            }

            if (! $ticketForSale->inBasket || $ticketForSale->basket_token !== $incomingToken) {
                return response()->json(['message' => "Ticket {$ticketId} is not reserved by your session."], 409);
            }

            if (! $ticketForSale->hasActiveReservation()) {
                return response()->json(['message' => "Your reservation for ticket {$ticketId} has expired. Please add it to your cart again."], 410);
            }

            $ticketListingId = $this->generateUniqueTicketListingId();

            DB::transaction(function () use ($ticketForSale, $ticketListingId, $email, $orderId) {
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
                    'orderId' => $orderId,
                ]);
                $ticketForSale->delete();
            });
        }

        return response()->json(['success' => true, 'message' => 'Ticket(s) marked as sold and history recorded.'], 200);
    }

    public function finalize(Request $request)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['message' => 'Missing or invalid basket token.'], 422);
        }

        $validated = $request->validate([
            'orderId' => ['required', 'integer', 'exists:orders,id'],
        ]);

        $orderId = (int) $validated['orderId'];
        $order = DB::table('orders')->where('id', $orderId)->first();
        $tickets = DB::table('active_tickets')->where('orderId', $orderId)->get();

        // Verify ownership: all tickets in this order must be held by the incoming basket token
        foreach ($tickets as $ticket) {
            $ticketForSale = DB::table('ticket_forsale')
                ->where('originalTicketId', $ticket->originalTicketId)
                ->first();

            if (! $ticketForSale || ! $ticketForSale->inBasket || $ticketForSale->basket_token !== $incomingToken) {
                return response()->json(['message' => 'You do not own the tickets in this order.'], 403);
            }
        }

        $historyCreated = 0;
        $listingsDeleted = 0;

        foreach ($tickets as $ticket) {
            DB::transaction(function () use ($ticket, $order, &$historyCreated, &$listingsDeleted) {
                $ticketForSale = DB::table('ticket_forsale')
                    ->where('originalTicketId', $ticket->originalTicketId)
                    ->first();

                if (! $ticketForSale) {
                    return;
                }

                $alreadyFinalized = DB::table('ticket_history')
                    ->where('ticketListingId', $ticket->ticketListingId)
                    ->exists();

                if (! $alreadyFinalized) {
                    DB::table('ticket_history')->insert([
                        'originalTicketId' => $ticket->originalTicketId,
                        'ticketListingId' => $ticket->ticketListingId,
                        'fromUserId' => $ticketForSale->fromUserId,
                        'toUser' => $order->deliveryEmail,
                        'price' => $ticketForSale->price,
                        'platformFee' => round($ticketForSale->price * 0.1, 2),
                    ]);

                    $historyCreated++;
                }

                $deleted = DB::table('ticket_forsale')
                    ->where('id', $ticketForSale->id)
                    ->delete();

                if ($deleted > 0) {
                    $listingsDeleted += $deleted;
                }
            });
        }

        return response()->json([
            'success' => true,
            'message' => 'Ticket(s) finalized and user information updated.',
            'data' => [
                'orderId' => $orderId,
                'ticketCount' => $tickets->count(),
                'historyCreated' => $historyCreated,
                'listingsDeleted' => $listingsDeleted,
            ],
        ], 200);
    }

    private function generateUniqueTicketListingId(): string
    {
        do {
            $ticketListingId = Str::ulid()->toString();
        } while (DB::table('active_tickets')->where('ticketListingId', $ticketListingId)->exists());

        return $ticketListingId;
    }

    private function isValidBasketToken(?string $token): bool
    {
        return is_string($token)
            && strlen($token) <= 36
            && Str::isUuid($token);
    }
}
