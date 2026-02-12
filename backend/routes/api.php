<?php

use App\Http\Controllers\ActiveTicketsController;
use App\Http\Controllers\VenueMapController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource("activeTickets", ActiveTicketsController::class);

Route::apiResource("venue", VenueMapController::class);