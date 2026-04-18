<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Tickets - ReTicket</title>
</head>
<body style="margin: 0; padding: 24px; background: #f6f7fb; font-family: Arial, sans-serif; color: #111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
        <tr>
            <td style="padding: 20px 22px; background: #111827; border-top: 5px solid #e8a020;">
                <h1 style="margin: 0; color: #ffffff; font-size: 22px;">Thank you for using ReTicket!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 22px;">
                <p style="margin: 0 0 12px;">You have purchased {{ $tickets->count() }} {{ Str::plural('ticket', $tickets->count()) }}:</p>
                <ul style="margin: 0 0 16px; padding-left: 20px;">
                    @foreach($tickets as $ticket)
                        <li style="margin-bottom: 8px;">
                            <strong>{{ $ticket->event_name }}</strong> - {{ $ticket->event_date }} at {{ $ticket->venue }}
                            @if($ticket->seat && $ticket->seat !== 'General Admission')
                                <br><span style="font-size: 12px; color: #6b7280;">Seat: {{ $ticket->seat }}</span>
                            @endif
                        </li>
                    @endforeach
                </ul>
                <p style="margin: 0 0 12px;">Each ticket is attached as a separate PDF. Present them at the entrance.</p>
                <p style="margin: 0;">- The ReTicket Team</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 12px 22px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
                ReTicket · Tickets are non-transferable.
            </td>
        </tr>
    </table>
</body>
</html>