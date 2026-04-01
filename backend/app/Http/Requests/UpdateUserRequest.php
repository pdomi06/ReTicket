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
        $user = $this->user();
        $model = $this->route('user');
        $isAdmin = $user->role === 'admin';
        $isOwnProfile = $user->id === $model->id;
        
        $rules = [
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
        ];
        
        if ($isOwnProfile || $isAdmin) {
            $rules['email'] = [
                'sometimes', 
                'email', 
                'max:255',
                Rule::unique('users', 'email')->ignore($model->id)
            ];
        }
        
        if ($isAdmin) {
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
        
        if (!$isAdmin && $user->id !== $model->id && $this->has('email')) {
            $this->offsetUnset('email');
        }
    }
}
