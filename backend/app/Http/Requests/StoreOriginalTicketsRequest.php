<?php

namespace App\Http\Requests;

use App\Models\OriginalTicket;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;

class StoreOriginalTicketsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', [OriginalTicket::class, Event::find($this->eventId)]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'eventId' => ['required', 'integer', 'exists:events,id'],
        'section' => ['required', 'string'],
        'row' => ['required', 'integer'],
        'seatNumber' => ['required', 'integer'],
        'price' => ['required', 'numeric', 'min:0'],
        'status' => ['required', 'in:pre-release,reserved,active,cancelled,expired'],
        'ticketPdfUrl' => ['required', 'string', 'url'],
        ];
    }
}
