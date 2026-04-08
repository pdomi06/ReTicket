<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use App\Notifications\EmailChangeNotifiable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Notifications\VerifyNewEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;

class EmailChangeController extends \Illuminate\Routing\Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except('confirmChange');
    }
    public function requestChange(Request $request)
    {
        $request->validate([
            'new_email' => ['required', 'email', 'unique:users,email'],
            'current_password' => ['required', 'string'],
        ]);

        $user = $request->user();
        if(!Hash::check($request->current_password, $user->getAuthPassword())) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $confirmationUrl = URL::temporarySignedRoute(
            'email.change.confirm',
            Carbon::now()->addMinutes(60),
            [
                'id' => $user->id,
                'new_email' => $request->new_email,
            ]
        );

        
            $notifiable = new EmailChangeNotifiable($request->new_email);
            $notifiable->notify(new VerifyNewEmail($confirmationUrl, $request->new_email));
        return response()->json(['message' => 'Verification link sent to your new email address.'], 200);
    }

    public function confirmChange(Request $request)
    {
        if(!$request->hasValidSignature()) {
            return response()->json(['message' => 'Invalid or expired token.'], 400);
        }

        $user = User::findOrFail($request->id);
        $newEmail = $request->query('new_email');

        $existingUser = User::where('email', $newEmail)->where('id', '!=', $user->id)->first();
        if ($existingUser) {
            return response()->json(['message' => 'The new email address is already in use.'], 422);
        }

        $oldEmail = $user->email;

        DB::transaction(function () use ($user, $newEmail, $oldEmail): void {
            $user->email = $newEmail;
            if (!$user->markEmailAsVerified()) {
                throw new \RuntimeException('Failed to update user verification state.');
            }

            Order::where('buyerEmail', $oldEmail)->update(['buyerEmail' => $newEmail]);
            Order::where('deliveryEmail', $oldEmail)->update(['deliveryEmail' => $newEmail]);
        });

        return response()->json(['message' => 'Email successfully changed.'], 200);
        }
}
