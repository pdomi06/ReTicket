<?php

namespace App\Http\Requests;

use App\Models\ActiveTicket;
use App\Models\OriginalTicket;
use Illuminate\Foundation\Http\FormRequest;

class StoreActiveTicketsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
    if (!$user) return false;

    $originalTicketId = $this->input('originalTicketId');
    $originalTicket = OriginalTicket::with('event')->find($originalTicketId);
    if (!$originalTicket) return false;

    return $user->can('createForEvent', [ActiveTicket::class, $originalTicket]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'orderId' => ['required', 'exists:orders,id'],
            'originalTicketId' => ['required','exists:original_tickets,id',
            function($attribute, $value, $fail){
                $originalTicket = OriginalTicket::find($value);
                if($originalTicket && $originalTicket->status !== 'active'){
                    $fail('The original ticket must be active to create an active ticket.');
                }
            },
        ],
        'ticketListingId' => ['required','string','unique:active_tickets,ticketListingId'],
        ];
    }
}
