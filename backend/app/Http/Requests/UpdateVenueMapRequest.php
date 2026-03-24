<?php

namespace App\Http\Requests;

use App\Models\VenueMap;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVenueMapRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $model = $this->route('venue');

        return $this->user()->can('update', $model);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'venue' => ['sometimes', 'string', 'max:255'],
        'section' => ['sometimes', 'string', 'max:255'],
        'rows' => ['sometimes', 'integer', 'min:1', 'max:50'],
        'cols' => ['sometimes', 'integer', 'min:1', 'max:50'],
        'rate' => ['sometimes', 'numeric', 'min:1', 'max:5'],
        ];
    }
}
