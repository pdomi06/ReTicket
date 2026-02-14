<?php

namespace App\Http\Controllers;

use App\Models\user;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreuserRequest;
use App\Http\Requests\UpdateuserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = user::all();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreuserRequest $request)
    {
        $user = user::create($request->all());
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(user $user, $id)
    {
        $user = user::find($id);
        
        if (!$user) {
            return response()->json(["message" => "User not found"], 404);
        }
        
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateuserRequest $request, user $user, $id)
    {
        $user = user::find($id);
        
        if (!$user) {
            return response()->json(["message" => "User not found"], 404);
        }
        
        $user->update($request->all());
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(user $user, $id)
    {
        $user = user::find($id);
        
        if (!$user) {
            return response()->json(["message" => "User not found"], 404);
        }
        
        $user->delete();
        return response()->json(["message" => "User deleted successfully"], 200);
    }
}