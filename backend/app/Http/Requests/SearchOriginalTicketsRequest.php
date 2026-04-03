<?php

namespace App\Http\Requests;

use App\Models\OriginalTicket;
use Illuminate\Foundation\Http\FormRequest;

class SearchOriginalTicketsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return !$this->user() || $this->user()->can('viewAny', OriginalTicket::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'eventId' => ['sometimes', 'nullable', 'integer'],
            'section' => ['sometimes', 'nullable', 'string', 'max:255'],
            'row' => ['sometimes', 'nullable', 'integer'],
            'seatNumber' => ['sometimes', 'nullable', 'integer'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'nullable', 'in:pre-release,reserved,active,cancelled,expired'],
            'ticketPdfUrl' => ['sometimes', 'nullable', 'string', 'url'],
        ];
    }
}
