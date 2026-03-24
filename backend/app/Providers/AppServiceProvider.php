<?php

namespace App\Providers;

use App\Models\User;
use App\Models\VenueMap;
use App\Policies\UserPolicy;
use App\Policies\VenueMapPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */


    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
    
    protected $policies = [
        User::class => UserPolicy::class,
        VenueMap::class => VenueMapPolicy::class,
    ];
}
