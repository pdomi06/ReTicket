<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;

class ApiEnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next, ...$redirectToRoute)
    {
        $user = $request->user();

        if (!$user || !$user instanceof MustVerifyEmail || $user->hasVerifiedEmail()) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Your email address is not verified.'], 403);
        }

        return redirect('/');
    }
}
