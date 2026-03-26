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
            'eventDate' => ['sometimes','integer','min:0','max:4102444800'],
            'eventEndDate' => ['sometimes','integer','min:0','max:4102444800'],
            'category' => ['sometimes','in:cultural,music,sport'],
            'basePrice' => ['sometimes','numeric','min:0'],
            'imageUrl' => ['sometimes','url'],
        ];
    }

    /**
     * Perform additional validation after the primary rules.
     * Ensures eventEndDate is not before eventDate, considering both
     * the current request data and the model's existing values.
     */
    public function after()
    {
        return function ($validator) {
            $event = $this->route('event');
            
            $eventDate = $this->filled('eventDate')
                ? $this->input('eventDate')
                : $event->eventDate;
            
            $eventEndDate = $this->filled('eventEndDate')
                ? $this->input('eventEndDate')
                : $event->eventEndDate;
            
            if ($eventDate !== null && $eventEndDate !== null) {
                if ($eventEndDate < $eventDate) {
                    $validator->errors()->add(
                        'eventEndDate',
                        'The event end date must be after the event start date.'
                    );
                }
            }
        };
    }
}
