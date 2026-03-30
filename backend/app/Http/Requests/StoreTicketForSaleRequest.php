<?php

namespace App\Http\Requests;

use App\Models\TicketForSale;
use Illuminate\Foundation\Http\FormRequest;

class StoreTicketForSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', TicketForSale::class);
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
        'eventId' => ['required', 'integer', 'exists:events,id'],
        'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
