<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    private const CONTACT_INBOX = 'reticket3@gmail.com';

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $data = $request->validated();

        Mail::to(self::CONTACT_INBOX)->send(new ContactMessageMail(
            senderEmail: $data['email'],
            messageBody: $data['message'],
            source: $data['source'] ?? 'footer',
        ));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully. We will get back to you soon.',
        ], 200);
    }
}
