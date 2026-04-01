<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketForSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $ticket = $this->route('ticketForSale');
        return $this->user()->can('update', $ticket);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'originalTicketId' => ['sometimes', 'integer', 'exists:original_tickets,id'],
        'fromUserId' => ['sometimes', 'integer', 'exists:user,id'],
        'eventId' => ['sometimes', 'integer', 'exists:events,id'],
        'price' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
