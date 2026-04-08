<?php
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\ActiveTicketsController;
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
use App\Http\Controllers\EmailChangeController;



Route::post('login', [AuthController::class, 'login'])->middleware('throttle:3,1');
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout']);
Route::get('events/search', [EventsController::class, 'search']);
Route::apiResource('events', EventsController::class);
Route::get('venues/search', [VenueMapController::class, 'search']);
Route::apiResource('venues', VenueMapController::class);
Route::apiResource('activeTickets', ActiveTicketsController::class);
Route::get('originalTickets/search', [OriginalTicketsController::class, 'search']);
Route::get("originalTickets/forSale/{eventId}", [OriginalTicketsController::class, "getOnlyAvailableTicketsInForSale"]);
Route::get("originalTickets/dashboard", [OriginalTicketsController::class, "dashboard"]);
Route::post("originalTickets/bulk", [OriginalTicketsController::class, "bulkStore"]);
Route::put("originalTickets/bulk", [OriginalTicketsController::class, "bulkUpdate"]);
Route::post("originalTickets/bulkStatusChange", [OriginalTicketsController::class, "bulkStatusChange"]);
Route::apiResource('originalTickets', OriginalTicketsController::class);
Route::get('ticketForSale/search', [TicketForSaleController::class, 'search']);
Route::post('ticketForSale/basketChange/{ticketForSale}', [TicketForSaleController::class, 'basketChange']);
Route::post('ticketForSale/addToBasket/{ticketForSale}', [TicketForSaleController::class, 'addToBasket']);
Route::post('ticketForSale/removeFromBasket/{ticketForSale}', [TicketForSaleController::class, 'removeFromBasket']);
Route::post('ticketForSale/checkOut', [TicketForSaleController::class, 'checkOut']);
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


Route::apiResource("orderItems", OrderItemsController::class);
Route::apiResource("orders", OrdersController::class);
Route::get('my/payouts', [PayoutsController::class, 'myPayouts']);
Route::get('ticketHistory/my/history', [TicketHistoryController::class, 'myHistory']);
Route::apiResource("userSettings", UserSettingsController::class);

Route::post('password/forgot', [PasswordResetController::class, 'store']);
Route::post('password/reset', [PasswordResetController::class, 'update']);
Route::get('payouts', [PayoutsController::class, 'index']);
Route::get('payouts/{payout}', [PayoutsController::class, 'show']);
Route::put('payouts/{payout}', [PayoutsController::class, 'update']);
Route::apiResource("reviews", ReviewsController::class);
Route::post('ticketHistory', [TicketHistoryController::class, 'store']);
Route::get('ticketHistory', [TicketHistoryController::class, 'index']);
Route::get('ticketHistory/{ticketHistory}', [TicketHistoryController::class, 'show']);