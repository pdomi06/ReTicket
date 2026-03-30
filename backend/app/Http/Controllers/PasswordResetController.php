<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePasswordResetRequest;
use App\Http\Requests\UpdatePasswordResetRequest;
use App\Models\User;
use Hash;
use Str;

class PasswordResetController extends Controller
{

    public function sendResetLink(StorePasswordResetRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'If that email exists, we have sent a reset link.'], 200);
        }
        PasswordReset::where('userId', $user->id)->delete();

        $token = Str::random(60);
        PasswordReset::create([
            'userId' => $user->id,
            'token' => $token,
            'expiresAt' => now()->addHour(),
            'verifiedAt' => null,
            'createdAt' => now(),
        ]);

        return response()->json(['message' => 'If that email exists, we have sent a reset link.'], 200);
    }
    public function reset(StorePasswordResetRequest $request)
    {
        $reset = PasswordReset::where('token', $request->token)->first();

        if (!$reset) {
            return response()->json(['message' => 'Invalid token.'], 400);
        }

        if (now()->gt($reset->expiresAt) || $reset->verifiedAt !== null) {
            return response()->json(['message' => 'Token expired or already used.'], 400);
        }

        $user = User::find($reset->userId);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->passwordHash = Hash::make($request->password);
        $user->save();

        $reset->verifiedAt = now();
        $reset->save();

        return response()->json(['message' => 'Password reset successful.'], 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $password_resets = PasswordReset::all();
        return response()->json($password_resets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePasswordResetRequest $request)
    {
        $user = User::where('email', $request->input('email'))->first();
        if (!$user) {
            return response()->json(['message' => 'If that email exists, we have sent a reset link.'], 404);
        }
        PasswordReset::where('userId', $user->id)->delete();
        $token = Str::random(60);
        $expiresAt = now()->addHours(1);

        PasswordReset::create([
            'userId' => $user->id,
            'token' => $token,
            'expiresAt' => $expiresAt,
            'verifiedAt' => null,
            'createdAt' => now(),
        ]);

        return response()->json(['message' => 'Password reset link sent'], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(PasswordReset $passwordReset)
    {
        return response()->json($passwordReset, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePasswordResetRequest $request, PasswordReset $passwordReset)
    {
        $reset = PasswordReset::where('token', $request->input('token'))->first();

        if ($reset === null) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        $isExpired = now()->gt($reset->expiresAt);
        $isUsed = $reset->verifiedAt !== null;
        if ($isExpired || $isUsed) {
            return response()->json(['message' => 'Token expired or already used.'], 400);
        }

        $user = User::find($reset->userId);
        if ($user === null) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->passwordHash = Hash::make($request->password);
        $user->save();

        $reset->verifiedAt = now();
        $reset->save();

        return response()->json(['message' => 'Password reset successful'], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PasswordReset $passwordReset)
    {
        $passwordReset->delete();
        return response()->json(["message" => "Password reset deleted successfully"], 200);
    }
}