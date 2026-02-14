<?php

namespace App\Http\Controllers;

use App\Models\orders;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreordersRequest;
use App\Http\Requests\UpdateordersRequest;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = orders::all();
        return response()->json($orders, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreordersRequest $request)
    {
        $order = orders::create($request->all());
        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(orders $order, $id)
    {
        $order = orders::find($id);
        
        if (!$order) {
            return response()->json(["message" => "Order not found"], 404);
        }
        
        return response()->json($order, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateordersRequest $request, orders $order, $id)
    {
        $order = orders::find($id);
        
        if (!$order) {
            return response()->json(["message" => "Order not found"], 404);
        }
        
        $order->update($request->all());
        return response()->json($order, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(orders $order, $id)
    {
        $order = orders::find($id);
        
        if (!$order) {
            return response()->json(["message" => "Order not found"], 404);
        }
        
        $order->delete();
        return response()->json(["message" => "Order deleted successfully"], 200);
    }
}