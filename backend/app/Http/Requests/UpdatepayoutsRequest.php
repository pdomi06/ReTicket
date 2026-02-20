<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatepayoutsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'vendorId' => ['sometimes', 'integer', 'exists:user,id'],
        'orderItemId' => ['sometimes', 'integer', 'exists:order_item,id'],
        'status' => ['sometimes', 'in:created,pending,cancelled,fulfilled'],
        'bank' => ['sometimes', 'string'],
        'iban' => ['sometimes', 'string'],
        'paidAt' => ['sometimes', 'date'],
        'createdAt' => ['sometimes', 'date'],
        ];
    }
}
