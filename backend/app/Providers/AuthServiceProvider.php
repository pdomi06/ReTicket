<?php

namespace App\Providers;

use App\Models\ActiveTicket;
use App\Models\EmailVerify;
use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OriginalTicket;
use App\Models\PasswordReset;
use App\Models\Payout;
use App\Models\Review;
use App\Models\TicketForSale;
use App\Models\TicketHistory;
use App\Models\User;
use App\Models\UserSetting;
use App\Models\VenueMap;
use App\Policies\ActiveTicketsPolicy;
use App\Policies\EmailVerifyPolicy;
use App\Policies\EventsPolicy;
use App\Policies\OrderItemsPolicy;
use App\Policies\OrdersPolicy;
use App\Policies\OriginalTicketsPolicy;
use App\Policies\PasswordResetPolicy;
use App\Policies\PayoutsPolicy;
use App\Policies\ReviewsPolicy;
use App\Policies\TicketForsalePolicy;
use App\Policies\TicketHistoryPolicy;
use App\Policies\UserPolicy;
use App\Policies\UserSettingsPolicy;
use App\Policies\VenueMapPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        ActiveTicket::class => ActiveTicketsPolicy::class,
        EmailVerify::class => EmailVerifyPolicy::class,
        Event::class => EventsPolicy::class,
        Order::class => OrdersPolicy::class,
        OrderItem::class => OrderItemsPolicy::class,
        OriginalTicket::class => OriginalTicketsPolicy::class,
        PasswordReset::class => PasswordResetPolicy::class,
        Payout::class => PayoutsPolicy::class,
        Review::class => ReviewsPolicy::class,
        TicketForSale::class => TicketForsalePolicy::class,
        TicketHistory::class => TicketHistoryPolicy::class,
        User::class => UserPolicy::class,
        UserSetting::class => UserSettingsPolicy::class,
        VenueMap::class => VenueMapPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
