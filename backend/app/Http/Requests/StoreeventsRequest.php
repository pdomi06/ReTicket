<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventsRequest extends FormRequest
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
            'name' => ['required','string'],
            'description' => ['required','string'],
            'venue' => ['required','string'],
            'address' => ['required','string'],
            'city' => ['required','string'],
            'state' => ['required','string'],
            'country' => ['required','string'],
            'eventDate' => ['required','date'],
            'eventEndDate' => ['required','date','after_or_equal:eventDate'],
            'category' => ['required','in:cultural,music,sport'],
            'basePrice' => ['required','numeric','min:0'],
            'imageUrl' => ['required','url'],

        ];
    }
}
