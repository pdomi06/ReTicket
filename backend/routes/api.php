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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::apiResource('events', EventsController::class)->only(['index']);
Route::get('events/search', [EventsController::class, 'search']);

Route::apiResource('venue', VenueMapController::class)->only(['index']);
Route::get('venues/search', [VenueMapController::class, 'search']);

Route::apiResource('activeTickets', ActiveTicketsController::class)->only(['index']);

Route::apiResource('emailVerify', EmailVerifyController::class)->only(['index']);

Route::apiResource('orderItems', OrderItemsController::class)->only(['index']);

Route::apiResource('orders', OrdersController::class)->only(['index']);

Route::apiResource('originalTickets', OriginalTicketsController::class)->only(['index']);
Route::get('originalTickets/search', [OriginalTicketsController::class, 'search']);

Route::apiResource('passwordReset', PasswordResetController::class)->only(['index']);

Route::apiResource('payouts', PayoutsController::class)->only(['index']);

Route::apiResource('reviews', ReviewsController::class)->only(['index']);

Route::apiResource('ticketForSale', TicketForSaleController::class)->only(['index']);
Route::get('ticketForSale/search', [TicketForSaleController::class, 'search']);

Route::apiResource('ticketHistory', TicketHistoryController::class)->only(['index']);

Route::apiResource('userSettings', UserSettingsController::class)->only(['index']);





Route::middleware('auth:sanctum')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('user', UserController::class)->only(['store']);

    Route::post('ticketForSale/basketChange/{ticketForSale}', [TicketForSaleController::class, 'basketChange']);
    Route::post('ticketForSale/addToBasket/{ticketForSale}', [TicketForSaleController::class, 'addToBasket']);
    Route::post('ticketForSale/removeFromBasket/{ticketForSale}', [TicketForSaleController::class, 'removeFromBasket']);

    Route::post("originalTickets/bulk", [OriginalTicketsController::class, "bulkStore"]);
    Route::put("originalTickets/bulk", [OriginalTicketsController::class, "bulkUpdate"]);
    Route::post("originalTickets/bulkStatusChange", [OriginalTicketsController::class, "bulkStatusChange"]);
    Route::get("originalTickets/dashboard", [OriginalTicketsController::class, "dashboard"]);
    Route::get("originalTickets/forSale/{eventId}", [OriginalTicketsController::class, "getOnlyAvailableTicketsInForSale"]);
    Route::apiResource("originalTickets", OriginalTicketsController::class)->except(['index']);

    Route::apiResource("events", EventsController::class)->except(['index']);

    Route::apiResource("venue", VenueMapController::class)->except(['index']);

    Route::apiResource("activeTickets", ActiveTicketsController::class)->except(['index']);

    Route::apiResource("emailVerify", EmailVerifyController::class)->except(['index']);

    Route::apiResource("orderItems", OrderItemsController::class)->except(['index']);

    Route::apiResource("orders", OrdersController::class)->except(['index']);

    Route::apiResource("passwordReset", PasswordResetController::class)->except(['index']);

    Route::apiResource("payouts", PayoutsController::class)->except(['index']);

    Route::apiResource("reviews", ReviewsController::class)->except(['index']);

    Route::apiResource("ticketForSale", TicketForSaleController::class)->except(['index']);

    Route::apiResource("ticketHistory", TicketHistoryController::class)->except(['index']);

    Route::apiResource("userSettings", UserSettingsController::class)->except(['index']);
});