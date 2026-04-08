<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyNewEmail extends Notification
{
    use Queueable;

    protected $confirmationUrl;
    protected $newEmail;

    /**
     * Create a new notification instance.
     */
    public function __construct($confirmationUrl, $newEmail)
    {
        $this->confirmationUrl = $confirmationUrl;
        $this->newEmail = $newEmail;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Confirm Your New Email Address')
            ->line('You are receiving this email because you requested to change your email address.')
            ->line('Requested new email: ' . $this->newEmail)
            ->action('Confirm Email Change', $this->confirmationUrl)
            ->line('If you did not request to change your email address, no further action is required.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
