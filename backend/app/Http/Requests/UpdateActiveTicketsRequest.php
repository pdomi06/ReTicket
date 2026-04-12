<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActiveTicketsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $activeTicket = $this->route('activeTicket');
        return $this->user()->can('update', $activeTicket);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'orderId' => ['sometimes', 'exists:orders,id'],
            'originalTicketId' => ['sometimes','exists:original_tickets,id'],
                    'ticketListingId' => ['sometimes', 'string', 'unique:active_tickets,ticketListingId,' . $this->route('activeTicket')->id],
        ];
    }
}
