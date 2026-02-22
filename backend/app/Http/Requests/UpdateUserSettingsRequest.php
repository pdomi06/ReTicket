<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserSettingsRequest extends FormRequest
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
        'userId' => ['sometimes', 'integer', 'exists:user,id'],
        'emailNotifications' => ['sometimes', 'boolean'],
        'smsNotifications' => ['sometimes', 'boolean'],
        'profileVisibility' => ['sometimes', 'in:visible,restricted,banned'],
        'createdAt' => ['sometimes', 'date'],
        'updatedAt' => ['sometimes', 'date'],
        ];
    }
}
