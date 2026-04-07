<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Notifiable;

class EmailChangeNotifiable extends Notification
{
    use Queueable;
    use Notifiable;
    protected $email;

    /**
     * Create a new notification instance.
     */
    public function __construct($email)
    {
        $this->email = $email;
    }


    public function routeNotificationForMail()
    {
        return $this->email;
    }
}
