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
            new Middleware('auth:sanctum', except: ['checkOut']),
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
        $this->authorize('create', Order::class);
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $order = new Order($data);
            $order->orderNumber = $this->generateOrderNumber();
            $order->save();

            foreach ($data['tickets'] as $ticketId) {
                $ticketForSale = TicketForSale::where('id', $ticketId)->first();
                $ticket = ActiveTicket::insert([
                    'ticketListingId' => $this->generateUniqueTicketListingId(),
                    "originalTicketId" => $ticketForSale->originalTicketId,
                ]);
                OrderItem::create([
                    'orderId' => $order->id,
                    'ticketListingId' => $ticket['ticketListingId'],
                    'price' => $ticketForSale->price,
                ]);
            }
        });

        return response()->json($order, 201);
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

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $this->authorize('view', $order);
        return response()->json($order, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrdersRequest $request, Order $order)
    {
        $this->authorize('update', $order);
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