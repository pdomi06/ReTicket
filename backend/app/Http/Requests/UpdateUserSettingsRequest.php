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
        $userSetting = $this->route('userSetting');
        return $this->user()->can('update', $userSetting);
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
