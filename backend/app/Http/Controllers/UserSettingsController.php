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
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeuser_settingsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(user_settings $user_settings)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(user_settings $user_settings)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateuser_settingsRequest $request, user_settings $user_settings)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(user_settings $user_settings)
    {
        //
    }
}
