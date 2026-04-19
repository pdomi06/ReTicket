<?php

use App\Http\Controllers\ActiveTicketsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EmailChangeController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\OriginalTicketsController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PayoutsController;
use App\Http\Controllers\ReviewsController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketForSaleController;
use App\Http\Controllers\TicketHistoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserSettingsController;
use App\Http\Controllers\VenueMapController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->middleware('throttle:3,1');
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('contact/messages', [ContactController::class, 'store'])->middleware('throttle:5,1');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::get('events/landing', [EventsController::class, 'landing']);
Route::get('events/search', [EventsController::class, 'search']);
Route::apiResource('events', EventsController::class);
Route::get('venues/search', [VenueMapController::class, 'search']);
Route::apiResource('venues', VenueMapController::class);
Route::post('activeTickets/validate', [ActiveTicketsController::class, 'validateTicket']);
Route::post('activeTickets/checkTicket', [ActiveTicketsController::class, 'checkTicket'])
    ->middleware('throttle:10,1');
Route::post('activeTickets/resell', [ActiveTicketsController::class, 'resellTicket']);
Route::apiResource('activeTickets', ActiveTicketsController::class);
Route::get('originalTickets/search', [OriginalTicketsController::class, 'search']);
Route::get("originalTickets/forSale/{eventId}", [OriginalTicketsController::class, "getOnlyAvailableTicketsInForSale"]);
Route::get("originalTickets/dashboard", [OriginalTicketsController::class, "dashboard"]);
Route::post("originalTickets/bulk", [OriginalTicketsController::class, "bulkStore"]);
Route::put("originalTickets/bulk", [OriginalTicketsController::class, "bulkUpdate"]);
Route::post("originalTickets/bulkStatusChange", [OriginalTicketsController::class, "bulkStatusChange"]);
Route::apiResource('originalTickets', OriginalTicketsController::class);
Route::get('ticketForSale/search', [TicketForSaleController::class, 'search']);
Route::get('ticketForSale/dashboard', [TicketForSaleController::class, 'dashboard']);
Route::post('ticketForSale/basketChange/{ticketForSale}', [TicketForSaleController::class, 'basketChange']);
Route::post('ticketForSale/addToBasket/{ticketForSale}', [TicketForSaleController::class, 'addToBasket']);
Route::post('ticketForSale/removeFromBasket/{ticketForSale}', [TicketForSaleController::class, 'removeFromBasket']);
Route::post('ticketForSale/checkOut', [TicketForSaleController::class, 'checkOut']);
Route::post('ticketForSale/finalize', [TicketForSaleController::class, 'finalize']);
Route::post('checkout', [StripeController::class, 'checkOut']);
Route::get('checkout/session', [StripeController::class, 'checkoutSession']);
Route::post('orders/checkOut', [StripeController::class, 'checkOut']);
Route::apiResource('ticketForSale', TicketForSaleController::class);
Route::apiResource('user', UserController::class);


Route::get('/email/verify/{id}/{hash}', function (Request $request, string $id, string $hash) {
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found.'], 404);
    }

    if (!hash_equals($hash, sha1($user->getEmailForVerification()))) {
        return response()->json(['message' => 'Invalid verification link.'], 403);
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return response()->json(['message' => 'Email verified successfully.'], 200);
})->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email is already verified.'], 200);
    }

    $user->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent.'], 200);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send');



Route::post('/user/email/change', [EmailChangeController::class, 'requestChange'])
    ->middleware(['throttle:6,1']);

Route::get('/user/email/confirm/{id}', [EmailChangeController::class, 'confirmChange'])
    ->middleware(['signed', 'throttle:6,1'])->name('email.change.confirm');


Route::post('orderItems', [OrderItemsController::class, 'store'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orderItems.store');
Route::match(['put', 'patch'], 'orderItems/{orderItem}', [OrderItemsController::class, 'update'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orderItems.update');
Route::apiResource("orderItems", OrderItemsController::class)->except(['store', 'update']);
Route::post('orders', [OrdersController::class, 'store'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orders.store');
Route::get('orders/{order}', [OrdersController::class, 'show'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orders.show');
Route::match(['put', 'patch'], 'orders/{order}', [OrdersController::class, 'update'])
    ->withoutMiddleware(['auth:sanctum', 'verified'])
    ->name('orders.update');
Route::apiResource("orders", OrdersController::class)->except(['store', 'show', 'update']);
Route::get('my/payouts', [PayoutsController::class, 'myPayouts']);
Route::apiResource("userSettings", UserSettingsController::class);

Route::post('password/forgot', [PasswordResetController::class, 'store']);
Route::post('password/reset', [PasswordResetController::class, 'update']);
Route::get('payouts', [PayoutsController::class, 'index']);
Route::get('payouts/{payout}', [PayoutsController::class, 'show']);
Route::put('payouts/{payout}', [PayoutsController::class, 'update']);
Route::get('my/payouts', [PayoutsController::class, 'myPayouts'])->middleware('auth:sanctum');
Route::get('reviews/visible', [ReviewsController::class, 'visible']);
Route::apiResource("reviews", ReviewsController::class);
Route::post('ticketHistory', [TicketHistoryController::class, 'store']);
Route::get('ticketHistory', [TicketHistoryController::class, 'index']);
Route::get('ticketHistory/myHistory', [TicketHistoryController::class, 'myHistory']);
Route::get('ticketHistory/{ticketHistory}', [TicketHistoryController::class, 'show'])->whereNumber('ticketHistory');
Route::post('tickets/{ticket}/send', [TicketController::class, 'send']);