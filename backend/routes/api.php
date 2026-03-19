<?php

use App\Http\Controllers\ActiveTicketsController;
use App\Http\Controllers\EmailVerifyController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\OriginalTicketsController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PayoutsController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\TicketForSaleController;
use App\Http\Controllers\TicketHistoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserSettingsController;
use App\Http\Controllers\VenueMapController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::get('events', [EventsController::class, 'index']);
Route::get('events/search', [EventsController::class, 'search']);
Route::get('events/{event}', [EventsController::class, 'show']);

    
Route::get('venues', [VenueMapController::class, 'index']);
Route::get('venues/search', [VenueMapController::class, 'search']);

Route::get('activeTickets', [ActiveTicketsController::class, 'index']);

Route::get('originalTickets', [OriginalTicketsController::class, 'index']);
Route::get('originalTickets/search', [OriginalTicketsController::class, 'search']);
Route::get("originalTickets/forSale/{eventId}", [OriginalTicketsController::class, "getOnlyAvailableTicketsInForSale"]);

Route::get('ticketForSale', [TicketForSaleController::class, 'index']);
Route::get('ticketForSale/search', [TicketForSaleController::class, 'search']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);

    Route::post("originalTickets/bulk", [OriginalTicketsController::class, "bulkStore"]);
    Route::put("originalTickets/bulk", [OriginalTicketsController::class, "bulkUpdate"]);

    Route::post('ticketForSale/basketChange/{ticketForSale}', [TicketForSaleController::class, 'basketChange']);
    Route::post('ticketForSale/addToBasket/{ticketForSale}', [TicketForSaleController::class, 'addToBasket']);
    Route::post('ticketForSale/removeFromBasket/{ticketForSale}', [TicketForSaleController::class, 'removeFromBasket']);
    
    Route::apiResource('user', UserController::class);
    
    Route::post("originalTickets/bulkStatusChange", [OriginalTicketsController::class, "bulkStatusChange"]);
    Route::get("originalTickets/dashboard", [OriginalTicketsController::class, "dashboard"]);
    
    Route::apiResource("originalTickets", OriginalTicketsController::class)->except(['index']);

    Route::apiResource("venues", VenueMapController::class)->except(['index']);

    Route::apiResource("activeTickets", ActiveTicketsController::class)->except(['index']);

    Route::apiResource("emailVerify", EmailVerifyController::class);

    Route::apiResource("orderItems", OrderItemsController::class);

    Route::apiResource("orders", OrdersController::class);

    Route::apiResource("passwordReset", PasswordResetController::class);

    Route::apiResource("payouts", PayoutsController::class);

    Route::apiResource("reviews", ReviewsController::class)->except(['index']);

    Route::apiResource("ticketForSale", TicketForSaleController::class)->except(['index']);

    Route::apiResource("ticketHistory", TicketHistoryController::class);

    Route::apiResource("userSettings", UserSettingsController::class);
});