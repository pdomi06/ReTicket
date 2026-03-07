<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchVenueMapRequest extends FormRequest
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
            'venue' => ['nullable', 'string', 'max:255'],
            'section' => ['nullable', 'string', 'max:255'],
                'rows' => ['nullable', 'integer', 'min:1'],
                'cols' => ['nullable', 'integer', 'min:1'],
                'rate' => ['nullable', 'numeric', 'decimal:1', 'min:0.1', 'max:9.9'],
        ];
    }
}
