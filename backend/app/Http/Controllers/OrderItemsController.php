<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderItemsRequest;
use App\Http\Requests\UpdateOrderItemsRequest;

class OrderItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order_items = OrderItem::all();
        return response()->json($order_items, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderItemsRequest $request)
    {
        $order_item = OrderItem::create(attributes: $request->validated());
        return response()->json($order_item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderItem $orderItem)
    {
        return response()->json($orderItem, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderItemsRequest $request, OrderItem $orderItem)
    {
        $orderItem->update($request->validated());
        return response()->json($orderItem, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();
        return response()->json(["message" => "Order item deleted successfully"], 200);
    }
}