<?php

namespace App\Http\Requests;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Event::class);
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
            'eventDate' => ['required','integer','min:0','max:4102444800'],
            'eventEndDate' => ['required','integer','min:0','max:4102444800'],
            'category' => ['required','in:cultural,music,sport'],
            'basePrice' => ['required','numeric','min:0'],
            'imageUrl' => ['required','url'],
            'isFeatured' => ['sometimes','boolean'],

        ];
    }

    /**
     * Perform additional validation after the primary rules.
     * Ensures eventEndDate is not before eventDate.
     */
    public function after(): array
    {
        return [
            function ($validator) {
                if ($this->filled('eventDate') && $this->filled('eventEndDate')) {
                    if ($this->input('eventEndDate') < $this->input('eventDate')) {
                        $validator->errors()->add(
                            'eventEndDate',
                            'The event end date must be after the event start date.'
                        );
                    }
                }
            }
        ];
    }
}
