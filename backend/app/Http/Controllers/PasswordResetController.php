<?php

namespace App\Http\Controllers;

use App\Models\PasswordReset;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storepassword_resetRequest;
use App\Http\Requests\Updatepassword_resetRequest;

class PasswordResetController extends Controller
{
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
    public function store(Storepassword_resetRequest $request)
    {
        $password_reset = PasswordReset::create($request->all());
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
    public function update(Updatepassword_resetRequest $request, PasswordReset $passwordReset)
    {
        $passwordReset->update($request->all());
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