<?php

namespace App\Policies;

use App\Models\User;
use App\Models\OriginalTicket;

class OriginalTicketsPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OriginalTicket $originalTickets): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'organizer'], true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OriginalTicket|string $originalTickets): bool
    {
        if (is_string($originalTickets)) {
            return in_array($user->role, ['admin', 'organizer'], true);
        }

        if($user->role === 'organizer' && $originalTickets->event->organizer_id === $user->id) {
            return true;
        }
        if($user->role === 'admin') {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OriginalTicket $originalTickets): bool
    {
        if($user->role === 'organizer' && $originalTickets->event->organizer_id === $user->id) {
            return true;
        }
        if($user->role === 'admin') {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, OriginalTicket $originalTickets): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, OriginalTicket $originalTickets): bool
    {
        return false;
    }
}
