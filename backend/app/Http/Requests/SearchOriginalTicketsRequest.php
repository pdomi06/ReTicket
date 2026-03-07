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
            'eventId' => ['nullable', 'integer'],
            'section' => ['nullable', 'string', 'max:255'],
            'row' => ['nullable', 'integer'],
            'seatNumber' => ['nullable', 'integer'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:pre-release,active,cancelled,expired'],
            'ticketPdfUrl' => ['nullable', 'string', 'url'],
        ];
    }
}
