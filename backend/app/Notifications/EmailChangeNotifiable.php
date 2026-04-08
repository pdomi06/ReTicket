<?php

namespace App\Notifications;

use Illuminate\Notifications\Notifiable;

class EmailChangeNotifiable
{
    use Notifiable;

    protected string $email;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $email)
    {
        $this->email = $email;
    }


    public function routeNotificationForMail($notification = null): string
    {
        return $this->email;
    }
}
