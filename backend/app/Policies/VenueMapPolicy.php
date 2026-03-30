<?php

namespace App\Policies;

use App\Models\VenueMap;
use App\Models\User;

class VenueMapPolicy
{
    /**
     * Admin can perform every action on venue maps.
     */
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
    public function view(?User $user, VenueMap $venueMap): bool
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
    public function update(User $user, VenueMap $venueMap): bool
    {
        if($user->role === 'organizer' && $venueMap->organizer_id === $user->id) {
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
    public function delete(User $user, VenueMap $venueMap): bool
    {
        if($user->role === 'organizer' && $venueMap->organizer_id === $user->id) {
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
    public function restore(User $user, VenueMap $venueMap): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, VenueMap $venueMap): bool
    {
        return false;
    }
}
