<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'reviewerName' => ['sometimes', 'string', 'max:255'],
        'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
        'title' => ['sometimes', 'string', 'max:255'],
        'comment' => ['sometimes', 'string'],
        'isVisible' => ['sometimes', 'boolean'],
        ];
    }
}
