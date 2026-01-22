<?php

namespace App\Http\Controllers;

use App\Models\password_reset;
use App\Http\Requests\Storepassword_resetRequest;
use App\Http\Requests\Updatepassword_resetRequest;

class PasswordResetController extends Controller
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
    public function store(Storepassword_resetRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(password_reset $password_reset)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(password_reset $password_reset)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatepassword_resetRequest $request, password_reset $password_reset)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(password_reset $password_reset)
    {
        //
    }
}
