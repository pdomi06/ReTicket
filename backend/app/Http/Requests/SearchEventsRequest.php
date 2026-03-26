<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchEventsRequest extends FormRequest
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
            'name' => ['nullable', 'string', 'max:255'],
            'venue' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'eventDate' => ['nullable', 'date_format:Y-m-d'],
            'timezone' => ['nullable', 'string'],
            'maxPrice' => ['nullable', 'numeric', 'min:0'],
            'category' => ['nullable', 'in:cultural,music,sport'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Perform additional validation after the primary rules.
     * Validates that the timezone is a valid UTC offset format that DateTimeZone accepts.
     */
    public function after()
    {
        return function ($validator) {
            if ($this->filled('timezone')) {
                $timezone = $this->input('timezone');
                try {
                    new \DateTimeZone($timezone);
                } catch (\Exception) {
                    $validator->errors()->add(
                        'timezone',
                        'The timezone must be a valid UTC offset (e.g., +00:00, +05:30, -08:00).'
                    );
                }
            }
        };
    }
}
