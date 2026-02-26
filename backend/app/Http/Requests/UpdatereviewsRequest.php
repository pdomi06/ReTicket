<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReviewsRequest extends FormRequest
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
        'orderItemId' => ['sometimes', 'integer', 'exists:order_items,id', Rule::unique('reviews')->ignore($this->route('review'))],
        'reviewerName' => ['sometimes', 'string', 'max:255'],
        'reviewedUserId'=> ['sometimes', 'integer', 'exists:user,id'],
        'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
        'title' => ['sometimes', 'string', 'max:255'],
        'comment' => ['sometimes', 'string'],
        'isVisible' => ['sometimes', 'boolean'],
        ];
    }
}
