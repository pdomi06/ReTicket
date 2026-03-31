<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required','email','unique:users,email'],
            'role' => ['sometimes', 'in:admin,vendor,organizer'],
            'password' => ['required','string','min:8','confirmed'],
            'name' => ['required','string'],
            'phone' => ['required','string'],
            'isVerified' => ['sometimes', 'boolean'],
            'isActive' => ['sometimes', 'boolean'],
            'isOnline' => ['sometimes', 'boolean'],
            'kycStatus' => ['sometimes', 'in:pending,rejected,approved'],
        ];
    }
}
