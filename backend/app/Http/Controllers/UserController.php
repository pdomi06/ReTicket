<?php

namespace App\Http\Controllers;

use App\Models\user;
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
        $user = user::create($request->validated());
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(user $user)
    {
        return response()->json($user, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateuserRequest $request, user $user)
    {
        $user->update($request->validated());
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(user $user)
    {
        $user->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
