<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrdersRequest extends FormRequest
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
            'subtotal' => ['required', 'numeric', 'min:0'],
            'platformFee' => ['required', 'numeric', 'min:0'],
            'tickets' => ['required', 'array', 'min:1'],
            'tickets.*' => ['required', 'integer', 'exists:ticket_forsale,id'],
        ];
    }
}
