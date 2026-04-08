<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckOutTicketForSaleRequest extends FormRequest
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
            'email' => ['required', 'email'],
            'orderId' => ['required', 'integer', 'exists:orders,id'],
            'tickets' => ['required', 'array'],
            'tickets.*' => ['required', 'integer', 'exists:ticket_forsale,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'email' => 'email parameter',
            'orderId' => 'order id parameter',
            'tickets' => 'tickets array',
            'tickets.*' => 'ticket ID',
        ];
    }
}
