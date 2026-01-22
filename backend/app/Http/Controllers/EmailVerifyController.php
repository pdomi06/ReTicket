<?php

namespace App\Http\Controllers;

use App\Models\email_verify;
use App\Http\Requests\Storeemail_verifyRequest;
use App\Http\Requests\Updateemail_verifyRequest;

class EmailVerifyController extends Controller
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
    public function store(Storeemail_verifyRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(email_verify $email_verify)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(email_verify $email_verify)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateemail_verifyRequest $request, email_verify $email_verify)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(email_verify $email_verify)
    {
        //
    }
}
