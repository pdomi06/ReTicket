<?php

use App\Http\Controllers\ActiveTicketsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get("/activeTickets", [ActiveTicketsController::class,"index"]);
Route::get("/activeTickets/{id}", [ActiveTicketsController::class,"show"]);
Route::post("/activeTickets", [ActiveTicketsController::class,"store"]);
Route::put("/activeTickets/{id}", [ActiveTicketsController::class,"update"]);
Route::delete("/activeTickets/{id}", [ActiveTicketsController::class,"destroy"]);