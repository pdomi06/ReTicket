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
        $email_verifies = email_verify::all();
        return response()->json($email_verifies, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storeemail_verifyRequest $request)
    {
        $email_verify = email_verify::create($request->validated());
        return response()->json($email_verify, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(email_verify $email_verify)
    {
        return response()->json($email_verify);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updateemail_verifyRequest $request, email_verify $email_verify)
    {
        $email_verify->update($request->validated());
        return response()->json($email_verify, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(email_verify $email_verify)
    {
        $email_verify->delete();
        return response()->json(['message' => 'Deleted successfully'], 200);
    }
}
