<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreuserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'email' => ['required', 'string', 'email', 'max:255', 'unique:user,email'],
        'password' => ['required', 'string', 'min:8'],
        'name' => ['required', 'string', 'max:255'],
        'phone' => ['required', 'string', 'max:20'],
        'isVerified' => ['sometimes', 'boolean'],
        'isActive' => ['sometimes', 'boolean'],
        'isOnline' => ['sometimes', 'boolean'],
        'kycStatus' => ['sometimes', 'in:pending,rejected,approved'],
        ];
    }
}
