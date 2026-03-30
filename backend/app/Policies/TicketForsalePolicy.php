<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TicketForsale;
use Illuminate\Auth\Access\Response;

class TicketForsalePolicy
{
    public function before(User $user): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TicketForsale $ticketForsale): bool
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
    public function update(User $user, TicketForsale $ticketForsale): bool
    {
        return $user->id === $ticketForsale->fromUserId;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TicketForsale $ticketForsale): bool
    {
        return $user->id === $ticketForsale->fromUserId;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TicketForsale $ticketForsale): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TicketForsale $ticketForsale): bool
    {
        return false;
    }

    public function modifyBasket(User $user, TicketForsale $ticketForsale): bool
    {
        return true;
    }
}
