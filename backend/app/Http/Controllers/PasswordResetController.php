<?php

namespace App\Http\Controllers;

use App\Models\password_reset;
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
        $password_resets = password_reset::all();
        return response()->json($password_resets, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storepassword_resetRequest $request)
    {
        $password_reset = password_reset::create($request->all());
        return response()->json($password_reset, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(password_reset $password_reset, $id)
    {
        $password_reset = password_reset::find($id);
        
        if (!$password_reset) {
            return response()->json(["message" => "Password reset not found"], 404);
        }
        
        return response()->json($password_reset, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatepassword_resetRequest $request, password_reset $password_reset, $id)
    {
        $password_reset = password_reset::find($id);
        
        if (!$password_reset) {
            return response()->json(["message" => "Password reset not found"], 404);
        }
        
        $password_reset->update($request->all());
        return response()->json($password_reset, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(password_reset $password_reset, $id)
    {
        $password_reset = password_reset::find($id);
        
        if (!$password_reset) {
            return response()->json(["message" => "Password reset not found"], 404);
        }
        
        $password_reset->delete();
        return response()->json(["message" => "Password reset deleted successfully"], 200);
    }
}