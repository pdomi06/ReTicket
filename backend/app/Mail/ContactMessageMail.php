<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $senderEmail,
        public readonly string $messageBody,
        public readonly ?string $source
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject('New Contact Message - ReTicket')
            ->replyTo($this->senderEmail)
            ->view('emails.contact-message', [
                'senderEmail' => $this->senderEmail,
                'messageBody' => $this->messageBody,
                'source' => $this->source,
                'sentAt' => now()->toDateTimeString(),
            ]);
    }
}
