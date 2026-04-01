<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Event;

class EventsPolicy
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
    public function view(User $user, Event $events): bool
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
    public function update(User $user, Event $events): bool
    {
        if($user->role === 'organizer' && $events->createdBy === $user->id) {
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
    public function delete(User $user, Event $events): bool
    {
        if($user->role === 'organizer' && $events->createdBy === $user->id) {
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
    public function restore(User $user, Event $events): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Event $events): bool
    {
        return false;
    }
}
