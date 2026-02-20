<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Storepassword_resetRequest extends FormRequest
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
        'userId' => ['required', 'integer', 'exists:users,id'],
        'token' => ['required', 'string', 'unique:password_resets,token'],
        'expiresAt' => ['required', 'date'],
        'verifiedAt' => ['nullable', 'date'],
        'createdAt' => ['required', 'date'],
        ];
    }
}
