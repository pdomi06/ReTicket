<?php

namespace App\Http\Requests;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderItemsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $order = Order::find($this->input('orderId'));
        if(!$order){
            return false;
        }
        if($order->deliveryEmail !== $this->user()->email){
            return false;
        }
        return $this->user()->can('create', OrderItem::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'orderId' => ['required','integer','exists:orders,id'],
            'ticketListingId' => ['required','exists:active_tickets,ticketListingId'],
            'price' => ['required','numeric','min:0'],
        ];
    }
}
