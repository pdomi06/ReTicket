<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Updateoriginal_ticketsRequest extends FormRequest
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
        'eventId' => ['sometimes', 'integer', 'exists:events,id'],
        'section' => ['sometimes', 'string'],
        'row' => ['sometimes', 'string'],
        'seatNumber' => ['sometimes', 'string'],
        'price' => ['sometimes', 'integer', 'min:0'],
        'status' => ['sometimes', 'in:pre-release,active,cancelled,expired'],
        'ticketPdfUrl' => ['sometimes', 'string', 'url'],
        'createdAt' => ['sometimes', 'date'],
        'updatedAt' => ['sometimes', 'date'],
        ];
    }
}
