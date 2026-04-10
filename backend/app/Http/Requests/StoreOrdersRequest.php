<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrdersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->user()?->can('create', Order::class)) {
            return true;
        }

        $email = $this->input('buyerEmail');
        $paymentIntentId = $this->input('paymentIntentId');

        return is_string($email) && is_string($paymentIntentId) && $email !== '' && $paymentIntentId !== '';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'buyerEmail' => ['required', 'email'],
        'subtotal' => ['required', 'numeric', 'min:0'],
        'platformFee' => ['required', 'numeric', 'min:0'],
        'tax' => ['nullable', 'numeric', 'min:0'],
        'paymentIntentId' => ['required', 'string'],
        'deliveryEmail' => ['required', 'email'],
        'status' => ['prohibited'],
        'paymentStatus' => ['prohibited'],
        'deliverStatus' => ['prohibited'],
        ];
    }
}
