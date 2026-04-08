<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderItemsRequest;
use App\Http\Requests\UpdateOrderItemsRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class OrderItemsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware('verified'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', OrderItem::class);
        $order_items = OrderItem::all();
        return response()->json($order_items, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderItemsRequest $request)
    {
        $this->authorize('create', OrderItem::class);
        $order_item = OrderItem::create(attributes: $request->validated());
        return response()->json($order_item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderItem $orderItem)
    {
        $this->authorize('view', $orderItem);
        return response()->json($orderItem, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderItemsRequest $request, OrderItem $orderItem)
    {
        $this->authorize('update', $orderItem);
        $orderItem->update($request->validated());
        return response()->json($orderItem, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderItem $orderItem)
    {
        $this->authorize('delete', $orderItem);
        $orderItem->delete();
        return response()->json(["message" => "Order item deleted successfully"], 200);
    }
}