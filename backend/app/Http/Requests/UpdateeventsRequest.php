<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventsRequest extends FormRequest
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
            'name' => ['sometimes','string'],
            'description' => ['sometimes','string'],
            'venue' => ['sometimes','string'],
            'address' => ['sometimes','string'],
            'city' => ['sometimes','string'],
            'state' => ['sometimes','string'],
            'country' => ['sometimes','string'],
            'eventDate' => ['sometimes','date'],
            'eventEndDate' => ['sometimes','date','after_or_equal:eventDate'],
            'category' => ['sometimes','in:cultural,music,sport'],
            'basePrice' => ['sometimes','integer','min:0'],
            'imageUrl' => ['sometimes','url'],
        ];
    }
}
