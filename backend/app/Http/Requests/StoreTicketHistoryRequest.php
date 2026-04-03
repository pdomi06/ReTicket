<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketHistoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
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
        'ticketListingId' => ['required', 'string'],
        'fromUserId' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
        'toUserId' => ['required', 'integer', 'exists:users,id'],
        'price' => ['required', 'numeric', 'min:0'],
        'platformFee' => ['required', 'numeric', 'min:0'],
        ];
    }
}
