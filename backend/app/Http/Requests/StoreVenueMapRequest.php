<?php

namespace App\Http\Requests;

use App\Models\VenueMap;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreVenueMapRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', VenueMap::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'venue'   => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:255'],
            'rows'    => ['required', 'integer', 'min:1'],
            'cols'    => ['required', 'integer', 'min:1'],
            'rate'    => ['required', 'numeric', 'min:0.1', 'max:9.9'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'The given data was invalid.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
