<?php

namespace App\Http\Controllers;

use App\Models\user_settings;
use App\Http\Requests\Storeuser_settingsRequest;
use App\Http\Requests\Updateuser_settingsRequest;

class UserSettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $all_user_settings = user_settings::all();
        return response()->json($all_user_settings, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeuser_settingsRequest $request)
    {
        $user_setting = user_settings::create($request->validated());
        return response()->json($user_setting, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(user_settings $user_setting)
    {
        return response()->json($user_setting, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateuser_settingsRequest $request, user_settings $user_setting)
    {
        $user_setting->update($request->validated());
        return response()->json($user_setting, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(user_settings $user_setting)
    {
        $user_setting->delete();
        return response()->json(["message" => "Deleted successfully"], 200);
    }
}
