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
        return $this->user()->can('create', UserSetting::class);
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
            'emailNotification' => ['required', 'boolean'],
            'smsNotification' => ['required', 'boolean'],
            'profileVisibility' => ['required', 'in:visible,restricted,banned'],
        ];
    }
}
