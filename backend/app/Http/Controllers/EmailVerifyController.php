<?php

namespace App\Http\Controllers;

use App\Models\EmailVerify;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmailVerifyRequest;
use App\Http\Requests\UpdateEmailVerifyRequest;

class EmailVerifyController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $email_verifies = EmailVerify::all();
        return response()->json($email_verifies, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmailVerifyRequest $request)
    {
        $email_verify = EmailVerify::create($request->validated());
        return response()->json($email_verify, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EmailVerify $emailVerify)
    {
        return response()->json($emailVerify, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmailVerifyRequest $request, EmailVerify $emailVerify)
    {
        $emailVerify->update($request->validated());
        return response()->json($emailVerify, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmailVerify $emailVerify)
    {
        $emailVerify->delete();
        return response()->json(["message" => "Email verification deleted successfully"], 200);
    }
}