<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePasswordResetRequest;
use App\Http\Requests\UpdatePasswordResetRequest;
use Illuminate\Support\Facades\Hash;
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
        abort(404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePasswordResetRequest $request)
    {
        $status = Password::sendResetLink($request->only('email'));

        \Log::debug('Password reset link requested');

        return response()->json([
            'message' => 'If a user with that email address exists, we have sent a password reset link.'
        ], 200);

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
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'passwordHash' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );
        return match ($status) {
            Password::PASSWORD_RESET => response()->json(["message" => "Password reset successfully."], 200),
            default => response()->json(["message" => "Unable to reset password. Please check your email and token and try again."], 400),
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