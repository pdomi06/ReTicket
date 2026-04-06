<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PasswordResetModel;

class PasswordResetPolicy
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
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether a reset link can be requested.
     */
    public function requestLink(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether a reset token can be submitted.
     */
    public function verifyToken(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PasswordResetModel $passwordReset): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PasswordResetModel $passwordReset): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PasswordResetModel $passwordReset): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PasswordResetModel $passwordReset): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PasswordResetModel $passwordReset): bool
    {
        return false;
    }
}
