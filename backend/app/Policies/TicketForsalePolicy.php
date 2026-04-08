<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TicketForSale;

class TicketForSalePolicy
{
    public function before(?User $user, string $ability): ?bool
    {
        if ($user && $user->role === 'admin') {
            return true;
        }
        return null;
    }
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, TicketForSale $ticketForSale): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->role === 'admin' || $user->role === 'vendor') {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TicketForSale $ticketForsale): bool
    {
        return $user->id === $ticketForsale->fromUserId;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TicketForSale $ticketForsale): bool
    {
        return $user->id === $ticketForsale->fromUserId;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TicketForSale $ticketForsale): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TicketForSale $ticketForsale): bool
    {
        return false;
    }

    public function modifyBasket(?User $user, TicketForSale $ticketForsale): bool
    {
        return true;
    }
}
