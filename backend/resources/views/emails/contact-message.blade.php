<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
    <h2>New Contact Message</h2>

    <p><strong>From:</strong> {{ $senderEmail }}</p>
    <p><strong>Source:</strong> {{ $source ?? 'footer' }}</p>
    <p><strong>Sent At:</strong> {{ $sentAt }}</p>

    <hr>

    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">{{ $messageBody }}</p>
</body>
</html>
