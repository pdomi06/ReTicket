<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorereviewsRequest extends FormRequest
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
        'orderItemId' => ['required', 'integer', 'exists:order_items,id'],
        'reviewerName' => ['required', 'string', 'max:255'],
        'reviewerUserId'=> ['required', 'integer', 'exists:user,id'],
        'rating' => ['required', 'integer', 'min:1', 'max:5'],
        'title' => ['required', 'string', 'max:255'],
        'comment' => ['required', 'string'],
        'isVisible' => ['required', 'boolean'],
        ];
    }
}
