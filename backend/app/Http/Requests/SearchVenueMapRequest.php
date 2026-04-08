<?php

namespace App\Http\Requests;

use App\Models\VenueMap;
use Illuminate\Foundation\Http\FormRequest;

class SearchVenueMapRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (!$this->user()) {
            return true;
        }
        return $this->user()->can('viewAny', VenueMap::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'venue' => ['sometimes', 'nullable', 'string', 'max:255'],
            'section' => ['sometimes', 'nullable', 'string', 'max:255'],
            'rows' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'cols' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'rate' => ['sometimes', 'nullable', 'numeric', 'decimal:1', 'min:0.1', 'max:9.9'],
        ];
    }
}
