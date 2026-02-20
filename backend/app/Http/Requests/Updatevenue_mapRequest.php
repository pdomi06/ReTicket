<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Updatevenue_mapRequest extends FormRequest
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
        'venue' => ['sometimes', 'string', 'max:255'],
        'section' => ['sometimes', 'string', 'max:255'],
        'row' => ['sometimes', 'string', 'max:50'],
        'seat' => ['sometimes', 'string', 'max:50'],
        'rate' => ['sometimes', 'numeric', 'min:1', 'max:5'],
        ];
    }
}
