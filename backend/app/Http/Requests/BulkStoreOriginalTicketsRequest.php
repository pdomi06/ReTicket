<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BulkStoreOriginalTicketsRequest extends FormRequest
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
            'eventId' => ['required', 'integer', 'exists:events,id'],
            'eventBasePrice' => ['required', 'numeric', 'min:0'],
            'venue' => ['required', 'array', 'min:1'],
            'venue.*.row' => ['required', 'integer'],
            'venue.*.col' => ['required', 'integer'],
            'venue.*.section' => ['required', 'string', 'max:255'],
            'venue.*.rate' => ['required', 'numeric', 'decimal:1'],
        ];
    }

    /**
     * Ensure validation errors return JSON instead of a redirect for API clients.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'The given data was invalid.',
            'errors' => $validator->errors(),
        ], 422));
    }
}