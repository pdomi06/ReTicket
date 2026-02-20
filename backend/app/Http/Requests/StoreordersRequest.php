<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreordersRequest extends FormRequest
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
        'orderNumber' => ['sometimes', 'integer', 'unique:orders,orderNumber'],
        'buyerEmail' => ['required', 'email'],
        'subtotal' => ['required', 'numeric', 'min:0'],
        'platformFee' => ['required', 'numeric', 'min:0'],
        'tax' => ['nullable', 'numeric', 'min:0'],
        'status' => ['required', 'in:pending,processing,completed,failed,refunded'],
        'paymentIntentId' => ['required', 'string'],
        'paymentStatus' => ['required', 'in:pending,authorized,captured,failed,refunded'],
        'deliveryEmail' => ['required', 'email'],
        'deliverStatus' => ['required', 'in:pending,sent,delivered'],
        'deliveredAt' => ['nullable', 'date'],
        'completedAt' => ['nullable', 'date'],
        'cancelledAt' => ['nullable', 'date'],
        'createdAt' => ['sometimes', 'date'],
        'updatedAt' => ['sometimes', 'date'],
        ];
    }
}
