<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrdersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if(!$user){
            return false;
        }
        return $user->email === $this->input('buyerEmail');
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
        'buyerEmail' => ['required', 'email', 'exists:users,email'],
        'subtotal' => ['required', 'numeric', 'min:0'],
        'platformFee' => ['required', 'numeric', 'min:0'],
        'tax' => ['nullable', 'numeric', 'min:0'],
        'paymentIntentId' => ['required', 'string'],
        'deliveryEmail' => ['required', 'email', 'exists:users,email'],
        ];
    }
}
