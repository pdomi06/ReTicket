<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'email' => ['sometimes','email','unique:user,email,' . $this->user?->id],
            'password' => ['sometimes','string','min:8','confirmed'],
            'name' => ['sometimes','string'],
            'phone' => ['sometimes','string'],
            'isVerified' => ['sometimes', 'boolean'],
            'isActive'   => ['sometimes', 'boolean'],
            'isOnline'   => ['sometimes', 'boolean'],
            'kycStatus'  => ['sometimes', 'in:pending,rejected,approved'],
            'lastLogin' => ['sometimes', 'date'],
        ];
    }
}
