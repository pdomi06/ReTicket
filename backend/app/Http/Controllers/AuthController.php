<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request){
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'passwordHash' => Hash::make($data['password']),
            'isActive' => true,
            'isVerified' => false,
            'phone' => $data['phone'],
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
            ]
        ], 201);
    }
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->getAuthPassword())) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
                'data' => null,
            ], 401);
        }

        if(!$user->isActive){
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact support.',
                'data' => null,
            ], 403);  
        };

        $user->update(['lastLogin' => now(), 'isOnline' => true]);

        if (method_exists($user,'tokens')){
            $user->tokens()->delete();
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if($user){
            $user->update(['isOnline' => false]);

            $token = $user->currentAccessToken();
            if ($token) {
                $token->delete();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->load('userSetting')
        ], 200);
    }
}
