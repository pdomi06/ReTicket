<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateuserRequest extends FormRequest
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
        'email'      => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $this->route('user')],
        'password'   => ['sometimes', 'string', 'min:8'],
        'name'       => ['sometimes', 'string', 'max:255'],
        'phone'      => ['sometimes', 'string', 'max:20'],
        'isVerified' => ['sometimes', 'boolean'],
        'isActive'   => ['sometimes', 'boolean'],
        'isOnline'   => ['sometimes', 'boolean'],
        'kycStatus'  => ['sometimes', 'in:pending,rejected,approved'],
        ];
    }
}
