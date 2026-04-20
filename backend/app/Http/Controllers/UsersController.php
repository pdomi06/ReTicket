<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UsersController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }

    /**
     * Get all users (admin only)
     */
    public function allUsers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $query = User::select('id', 'name', 'email', 'phone', 'role', 'balance', 'isActive', 'isVerified', 'isOnline', 'kycStatus', 'lastLogin', 'created_at');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Apply role filter
        if ($request->filled('role') && $request->input('role') !== 'all') {
            $query->where('role', $request->input('role'));
        }

        // Apply KYC status filter
        if ($request->filled('kycStatus') && $request->input('kycStatus') !== 'all') {
            $query->where('kycStatus', $request->input('kycStatus'));
        }

        // Apply account status filter
        if ($request->filled('accountStatus') && $request->input('accountStatus') !== 'all') {
            $status = $request->input('accountStatus');
            if ($status === 'active') {
                $query->where('isActive', true);
            } elseif ($status === 'suspended') {
                $query->where('isActive', false);
            }
        }

        // Apply verification filter
        if ($request->filled('verification') && $request->input('verification') !== 'all') {
            $verified = $request->input('verification') === 'verified';
            $query->where('isVerified', $verified);
        }

        // Get totals for stats before pagination
        $totalUsers = User::count();
        $activeUsers = User::where('isActive', true)->count();
        $suspendedUsers = User::where('isActive', false)->count();
        $pendingKyc = User::where('kycStatus', 'pending')->count();

        // Pagination
        $perPage = $request->input('per_page', 20);
        $page = $request->input('page', 1);
        $users = $query->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                    'last_page' => $users->lastPage(),
                ],
                'stats' => [
                    'totalUsers' => $totalUsers,
                    'activeUsers' => $activeUsers,
                    'suspendedUsers' => $suspendedUsers,
                    'pendingKyc' => $pendingKyc,
                ],
            ],
        ], 200);
    }

    /**
     * Get a single user (admin only)
     */
    public function show(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 200);
    }

    /**
     * Update a user (admin only)
     */
    public function update(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20',
            'role' => 'sometimes|in:vendor,organizer,admin',
            'kycStatus' => 'sometimes|in:pending,approved,rejected',
            'isActive' => 'sometimes|boolean',
            'isVerified' => 'sometimes|boolean',
        ]);

        $user->forceFill($validated)->save();

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User updated successfully.',
        ], 200);
    }

    /**
     * Delete a user (admin only)
     */
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ], 200);
    }
}

