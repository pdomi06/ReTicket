<?php

namespace App\Http\Requests;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderItemsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = Order::find($this->input('orderId'));

        if (!$order) {
            return false;
        }

        if ($this->user()?->can('create', OrderItem::class)) {
            return true;
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
            'orderId' => ['required', 'integer', 'exists:orders,id'],
            'buyerEmail' => [Rule::requiredIf(fn () => !$this->user()), 'nullable', 'email'],
            'ticketListingId' => ['required', 'exists:active_tickets,ticketListingId'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
