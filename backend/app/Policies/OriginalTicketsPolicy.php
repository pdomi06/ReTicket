<?php

namespace App\Policies;

use App\Models\User;
use App\Models\OriginalTicket;
use App\Models\Event;

class OriginalTicketsPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function before(?User $user, string $ability): ?bool
    {
        if ($user && $user->role === 'admin') {
            return true;
        }
        return null;
    }
    public function viewAny(?User $user): bool
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
        return $user->role === 'organizer' || $user->role === 'admin';
    }

    /**
     * Determine whether the user can create tickets for a specific event.
     */
    public function createForEvent(User $user, Event $event): bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return $user->role === 'organizer' && $event->createdBy === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OriginalTicket $originalTickets): bool
    {
        $event = $originalTickets->event;
        if ($user->role === 'organizer' && $event && $event->createdBy === $user->id) {
            return true;
        }
        if ($user->role === 'admin') {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can update tickets by event scope.
     */
    public function updateByEvent(User $user, Event $event): bool
    {
        if ($user->role === 'organizer' && $event->createdBy === $user->id) {
            return true;
        }
        if ($user->role === 'admin') {
            return true;
        }
        return false;
    }

    public function updateAny(User $user, Event $event): bool
{
    if ($user->role === 'admin') {
        return true;
    }
        return $user->role === 'organizer' && $event->createdBy === $user->id;
}

public function manageTicketStatus(User $user, Event $event): bool{
    return $this->updateAny($user, $event);
}

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OriginalTicket $originalTickets): bool
    {
        $event = $originalTickets->event;
        if ($user->role === 'organizer' && $event && $event->createdBy === $user->id) {
            return true;
        }
        if ($user->role === 'admin') {
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
