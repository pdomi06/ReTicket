<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePasswordResetRequest;
use App\Http\Requests\UpdatePasswordResetRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use App\Models\PasswordResetModel;

class PasswordResetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $password_resets = PasswordResetModel::all();
        return response()->json($password_resets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePasswordResetRequest $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return response()->json(["message" => "If a user with that email exists, a password reset link has been sent."], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(PasswordResetModel $passwordReset)
    {
        return response()->json($passwordReset, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePasswordResetRequest $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'passwordHash' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));
            }
        );
        return match($status){
            Password::PASSWORD_RESET => response()->json(["message" => "Password reset successfully."], 200),
            Password::INVALID_TOKEN => response()->json(["message" => "Invalid token."], 400),
            Password::INVALID_USER => response()->json(["message" => "User not found."], 404),
            default => response()->json(["message" => "An error occurred."], 400),  
        };

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PasswordResetModel $passwordReset)
    {
        $passwordReset->delete();
        return response()->json(["message" => "Password reset deleted successfully"], 200);
    }
}