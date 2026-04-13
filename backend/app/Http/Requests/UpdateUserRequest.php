<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $model = $this->route('user');
        
        return $user->can('update', $model);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
            'email' => ['prohibited'],
        ];
        
        if ($this->user()->role === 'admin') {
            $rules['role'] = ['sometimes', Rule::in(['vendor', 'organizer', 'admin'])];
            $rules['kycStatus'] = ['sometimes', Rule::in(['pending', 'rejected', 'approved'])];
            $rules['isVerified'] = ['sometimes', 'boolean'];
            $rules['isActive'] = ['sometimes', 'boolean'];
            $rules['isOnline'] = ['sometimes', 'boolean'];
            $rules['lastLogin'] = ['sometimes', 'date'];
        }
        
        return $rules;
    }
    
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $user = $this->user();
        $model = $this->route('user');
        $isAdmin = $user->role === 'admin';
        
        if (!$isAdmin) {
            $sensitiveFields = ['role', 'kycStatus', 'isVerified', 'isActive', 'isOnline', 'lastLogin'];
            foreach ($sensitiveFields as $field) {
                if ($this->has($field)) {
                    $this->offsetUnset($field);
                }
            }
        }
    }
}
