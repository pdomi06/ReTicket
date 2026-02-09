<?php

namespace App\Http\Controllers;

use App\Models\order_items;
use App\Http\Requests\Storeorder_itemsRequest;
use App\Http\Requests\Updateorder_itemsRequest;

class OrderItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order_items = order_items::all();
        return response()->json($order_items, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeorder_itemsRequest $request)
    {
        $order_item = order_items::create($request->validated());
        return response()->json($order_item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(order_items $order_item)
    {
        return response()->json($order_item, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Updateorder_itemsRequest $request, order_items $order_item)
    {
        $order_item->update($request->validated());
        return response()->json($order_item, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(order_items $order_item)
    {
        $order_item->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
