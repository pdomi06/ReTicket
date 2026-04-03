<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrdersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = $this->route('order');
        return $this->user()->can('update', $order);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'buyerEmail' => ['sometimes', 'email', 'exists:users,email'],
            'subtotal' => ['sometimes', 'numeric', 'min:0'],
            'platformFee' => ['sometimes', 'numeric', 'min:0'],
            'tax' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:pending,processing,completed,failed,refunded'],
            'paymentIntentId' => ['sometimes', 'string'],
            'paymentStatus' => ['sometimes', 'in:pending,authorized,captured,failed,refunded'],
            'deliveryEmail' => ['sometimes', 'email', 'exists:users,email'],
            'deliverStatus' => ['sometimes', 'in:pending,sent,delivered'],
            'deliveredAt' => ['sometimes', 'nullable', 'date'],
            'completedAt' => ['sometimes', 'nullable', 'date'],
            'cancelledAt' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
