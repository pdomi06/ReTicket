<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
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
        $all_user_settings = UserSetting::all();
        return response()->json($all_user_settings, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeuser_settingsRequest $request)
    {
        $user_setting = UserSetting::create($request->all());
        return response()->json($user_setting, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserSetting $userSetting)
    {
        return response()->json($userSetting, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateuser_settingsRequest $request, UserSetting $userSetting)
    {
        $userSetting->update($request->all());
        return response()->json($userSetting, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserSetting $userSetting)
    {
        $userSetting->delete();
        return response()->json(["message" => "User settings deleted successfully"], 200);
    }
}