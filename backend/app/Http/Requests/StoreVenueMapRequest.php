<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVenueMapRequest extends FormRequest
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
        'venue'   => ['required', 'string', 'max:255'],
        'section' => ['required', 'string', 'max:255'],
        'rows'     => ['required', 'integer', 'min:1'],
        'cols'    => ['required', 'integer', 'min:1'],
        'rate'    => ['required', 'numeric', 'min:1', 'max:5'],
        ];
    }
}
