<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayoutsRequest extends FormRequest
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
        'vendorId' => ['required', 'integer', 'exists:user,id'],
        'orderItemId' => ['required', 'integer', 'exists:order_item,id'],
        'status' => ['required', 'in:created,pending,cancelled,fulfilled'],
        'bank' => ['required', 'string'],
        'iban' => ['required', 'string'],
        'paidAt' => ['required', 'date'],
        ];
    }
}
