<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordResetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'userId' => ['required', 'integer', 'exists:user,id'],
            'token' => ['required', 'string'],
            'expiresAt' => ['required', 'date'],
            'verifiedAt' => ['required', 'date'],
            'createdAt' => ['required', 'date'],
        ];
    }
}
