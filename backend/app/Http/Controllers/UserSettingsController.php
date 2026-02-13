<?php

namespace App\Http\Controllers;

use App\Models\user_settings;
use App\Http\Controllers\Controller;
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
        $user_setting = user_settings::create($request->all());
        return response()->json($user_setting, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(user_settings $user_setting, $id)
    {
        $user_setting = user_settings::find($id);
        
        if (!$user_setting) {
            return response()->json(["message" => "User settings not found"], 404);
        }
        
        return response()->json($user_setting, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateuser_settingsRequest $request, user_settings $user_setting, $id)
    {
        $user_setting = user_settings::find($id);
        
        if (!$user_setting) {
            return response()->json(["message" => "User settings not found"], 404);
        }
        
        $user_setting->update($request->all());
        return response()->json($user_setting, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(user_settings $user_setting, $id)
    {
        $user_setting = user_settings::find($id);
        
        if (!$user_setting) {
            return response()->json(["message" => "User settings not found"], 404);
        }
        
        $user_setting->delete();
        return response()->json(["message" => "User settings deleted successfully"], 200);
    }
}