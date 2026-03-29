<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendVerificationLinkRequest;
use App\Http\Requests\VerifyEmailRequest;
use App\Models\EmailVerification;
use App\Models\User;
use Illuminate\Http\Request;
use Str;

class EmailVerificationController extends Controller
{
    public function sendLink(SendVerificationLinkRequest $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || $user->isVerified) {
            return response()->json(['message' => 'If that email exists, we have sent a verification link.'], 200);
        }
        EmailVerification::where('userId', $user->id)->delete();

        EmailVerification::create([
            'userId' => $user->id,
            'token' => Str::random(60),
            'expiresAt' => now()->addDays(1),
        ]);

        return response()->json(['message' => 'If that email exists, we have sent a verification link.'], 200);
    }

    public function verify(VerifyEmailRequest $request)
    {
        $verification = EmailVerification::where('token', $request->token)->first();

        if (!$verification) {
            return response()->json(['message' => 'Invalid token.'], 400);
        }

        if (now()->gt($verification->expiresAt) || $verification->verifiedAt !== null) {
            return response()->json(['message' => 'Token expired or already used.'], 400);
        }

        $user = User::find($verification->userId);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->isVerified = true;
        $user->save();

        $verification->verifiedAt = now();
        $verification->save();

        return response()->json(['message' => 'Email verified successfully.'], 200);
    }
}
