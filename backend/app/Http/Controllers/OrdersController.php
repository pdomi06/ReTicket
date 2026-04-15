<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrdersRequest;
use App\Http\Requests\UpdateOrdersRequest;
use App\Http\Requests\CheckOutOrdersRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\TicketForSale;
use App\Models\ActiveTicket;
use App\Models\OrderItem;

class OrdersController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['store', 'update']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Order::class);
        $orders = Order::all();

        return response()->json($orders, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrdersRequest $request)
    {
        $incomingToken = $request->header('X-Basket-Key');

        if (! $this->isValidBasketToken($incomingToken)) {
            return response()->json(['message' => 'Missing or invalid basket token.'], 422);
        }

        $data = $request->validated();
        $ticketIds = $request->input('tickets', []);

        DB::beginTransaction();

        try {
            $lockedTickets = [];

            // Validate that every ticket in the order is still reserved by this token under row lock
            foreach ($ticketIds as $ticketId) {
                $ticket = TicketForSale::whereKey($ticketId)->lockForUpdate()->first();

                if (! $ticket) {
                    DB::rollBack();
                    return response()->json(['message' => "Ticket {$ticketId} not found."], 404);
                }

                if (! $ticket->inBasket || $ticket->basket_token !== $incomingToken) {
                    DB::rollBack();
                    return response()->json(['message' => "Ticket {$ticketId} is not reserved by your session."], 409);
                }

                if (! $ticket->hasActiveReservation()) {
                    DB::rollBack();
                    return response()->json(['message' => "Your reservation for ticket {$ticketId} has expired. Please add it to your cart again."], 410);
                }

                if (ActiveTicket::where('originalTicketId', $ticket->originalTicketId)->exists()) {
                    DB::rollBack();
                    return response()->json(['message' => "Ticket {$ticketId} is already attached to an order."], 409);
                }

                $lockedTickets[] = $ticket;
            }

            $subtotal = array_reduce(
                $lockedTickets,
                fn(float $sum, TicketForSale $ticket): float => $sum + (float) $ticket->price,
                0.0
            );
            $platformFee = round($subtotal * 0.1, 2);

            $data['subtotal'] = $subtotal;
            $data['platformFee'] = $platformFee;

            $order = new Order($data);
            $order->orderNumber = $this->generateOrderNumber();
            $order->save();

            foreach ($lockedTickets as $ticketForSale) {
                $ticketListingId = $this->generateUniqueTicketListingId();

                OrderItem::create([
                    'orderId' => $order->id,
                    'ticketListingId' => $ticketListingId,
                    'price' => $ticketForSale->price,
                ]);

                ActiveTicket::create([
                    'ticketListingId' => $ticketListingId,
                    'originalTicketId' => $ticketForSale->originalTicketId,
                    'orderId' => $order->id,
                ]);
            }

            DB::commit();

            return response()->json($order, 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function generateOrderNumber(): int
    {
        do {
            $orderNumber = random_int(1000000, 9999999);
        } while (Order::where('orderNumber', $orderNumber)->exists());

        return $orderNumber;
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

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        if (auth()->check()) {
            if (!auth()->user()->can('view', $order)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            $buyerEmail = request()->query('email');
            if (!$buyerEmail || strcasecmp($order->buyerEmail, $buyerEmail) !== 0) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        return response()->json($order, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrdersRequest $request, Order $order)
    {
        $order->update($request->validated());
        return response()->json($order, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        $order->delete();
        return response()->json(["message" => "Order deleted successfully"], 200);
    }
}