<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Ticket - ReTicket</title>
</head>
<body style="margin: 0; padding: 24px; background: #f6f7fb; font-family: Arial, Helvetica, sans-serif; color: #111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
        <tr>
            <td style="padding: 20px 22px; background: #111827; border-top: 5px solid #e8a020;">
                <h1 style="margin: 0; color: #ffffff; font-size: 22px; line-height: 1.25;">Thank you for using ReTicket!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 22px; font-size: 15px; line-height: 1.6; color: #111827;">
                <p style="margin: 0 0 12px;">Your ticket for <strong>{{ $ticket->event_name }}</strong> on <strong>{{ $ticket->event_date }}</strong> is ready.</p>
                <p style="margin: 0 0 12px;">Venue: <strong>{{ $ticket->venue }}</strong></p>
                <p style="margin: 0;">Your PDF ticket is attached to this email. Present it at the entrance.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 12px 22px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
                ReTicket · This ticket is non-transferable.
            </td>
        </tr>
    </table>
</body>
</html>