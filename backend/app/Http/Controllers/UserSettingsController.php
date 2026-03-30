<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserSettingsRequest;
use App\Http\Requests\UpdateUserSettingsRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserSettingsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', UserSetting::class);
        $all_user_settings = UserSetting::all();
        return response()->json($all_user_settings, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserSettingsRequest $request)
    {
        $this->authorize('create', UserSetting::class);
        $data = $request->validated();
        $data['userId'] = auth()->id();
        $user_setting = UserSetting::create($data);
        return response()->json($user_setting, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserSetting $userSetting)
    {
        $this->authorize('view', $userSetting);
        return response()->json($userSetting, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserSettingsRequest $request, UserSetting $userSetting)
    {
        $this->authorize('update', $userSetting);
        $userSetting->update($request->validated());
        return response()->json($userSetting, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserSetting $userSetting)
    {
        $this->authorize('delete', $userSetting);
        $userSetting->delete();
        return response()->json(["message" => "User settings deleted successfully"], 200);
    }
}