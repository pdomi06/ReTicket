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
        $user = User::where('email', $request->input('email'))->first();
        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }
        PasswordReset::where('user_id', $user->id)->delete();
        $token = Str::random(60);
        PasswordReset::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => now()->addHours(1),
        ]);

        return response()->json(['message' => 'Password reset link sent'], 200);
    }
    public function reset(StorePasswordResetRequest $request){
        $reset = PasswordReset::where('token', $request->input('token'))->first();
        if(!$reset || now()->get($reset->expiresAt) || $reset->verifiedAt){
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user = User::find($reset->userId);
        $user->password = Hash::make($request->input('password'));
        $user->save();

        $reset->verifiedAt = now();
        $reset->save();
        return response()->json(['message' => 'Password reset successful'], 200);
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
        $password_reset = PasswordReset::create($request->validated());
        return response()->json($password_reset, 201);
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
        $passwordReset->update($request->validated());
        return response()->json($passwordReset, 200);
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