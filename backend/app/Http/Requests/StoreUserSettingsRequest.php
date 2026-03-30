<?php

namespace App\Http\Requests;

use App\Models\UserSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'emailNotification' => ['sometimes', 'boolean'],
            'smsNotification' => ['sometimes', 'boolean'],
            'profileVisibility' => ['sometimes', 'in:visible,restricted,banned'],
        ];
    }
}
