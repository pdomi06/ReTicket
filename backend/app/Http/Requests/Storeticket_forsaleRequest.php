<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Storeticket_forsaleRequest extends FormRequest
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
        'originalTicketId' => ['required', 'integer', 'exists:original_tickets,id'],
        'fromUserId' => ['required', 'integer', 'exists:user,id'],
        'price' => ['required', 'numeric', 'min:0'],
        'inBasket' => ['required', 'boolean'],
        ];
    }
}
