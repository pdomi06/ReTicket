<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderItemsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $orderItem = $this->route('orderItem');

        if (!$orderItem) {
            return false;
        }

        if ($this->user()?->can('update', $orderItem)) {
            return true;
        }

        $order = $orderItem->order;

        if (!$order) {
            return false;
        }

        if ($this->user()) {
            return $order->buyerEmail === $this->user()->email;
        }

        $buyerEmail = $this->input('buyerEmail');

        return is_string($buyerEmail)
            && $buyerEmail !== ''
            && strcasecmp($order->buyerEmail, $buyerEmail) === 0;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'buyerEmail' => [Rule::requiredIf(fn () => !$this->user()), 'nullable', 'email'],
            'price' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
