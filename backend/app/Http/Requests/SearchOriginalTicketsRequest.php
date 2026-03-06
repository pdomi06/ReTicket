<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchOriginalTicketsRequest extends FormRequest
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
            'eventId' => ['nullable', 'bigInteger'],
            'section' => ['nullable', 'string', 'max:255'],
            'row' => ['nullable', 'string', 'max:255'],
            'seatNumber' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:available,reserved,sold'],
            'ticketPdfUrl' => ['nullable', 'in:pre-release,active,cancelled,expired'],
        ];
    }
}
