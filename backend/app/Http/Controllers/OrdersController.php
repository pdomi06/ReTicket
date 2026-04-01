<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrdersRequest;
use App\Http\Requests\UpdateOrdersRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class OrdersController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Order::class);
        $user = auth()->user();
        $orders = Order::query();

        if($user->role !== 'admin') {
            $orders->where('buyerEmail', $user->email);
        }
        return response()->json($orders->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrdersRequest $request)
    {
        $this->authorize('create', Order::class);
        $data = $request->validated();

        $data['status'] = 'pending';
        $data['paymentStatus'] = 'pending';
        $data['deliverStatus'] = 'pending';
        $order = new Order($data);
        $order->orderNumber = $this->generateOrderNumber();
        $order->save();

        return response()->json($order, 201);
    }

    private function generateOrderNumber(): int
    {
        do {
            $orderNumber = random_int(1000000, 9999999);
        } while (Order::where('orderNumber', $orderNumber)->exists());

        return $orderNumber;
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