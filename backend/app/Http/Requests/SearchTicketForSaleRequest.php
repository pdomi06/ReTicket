<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchTicketForSaleRequest extends FormRequest
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
            'originalTicketId' => ['sometimes', 'nullable', 'integer'],
            'fromUserId' => ['sometimes', 'nullable', 'integer'],
            'eventId' => ['sometimes', 'nullable', 'integer'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'inBasket' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
