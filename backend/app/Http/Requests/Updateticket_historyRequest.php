<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Updateticket_historyRequest extends FormRequest
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
        'originalTicketId' => ['sometimes', 'integer', 'exists:original_tickets,id'],
        'ticketListingId' => ['sometimes', 'integer', 'exists:ticket_forsale,id'],
        'fromUserId' => ['sometimes', 'integer', 'exists:user,id'],
        'toUserId' => ['sometimes', 'integer', 'exists:user,id'],
        'price' => ['sometimes', 'numeric', 'min:0'],
        'platformFee' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
