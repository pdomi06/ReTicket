<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Ticket</title>
    <style>
        @page {
            margin: 24px;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans, sans-serif;
            color: #111827;
            background: #f7f7f8;
            font-size: 13px;
            line-height: 1.35;
        }

        .page-safe {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .ticket-card {
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            overflow: hidden;
            background: #ffffff;
        }

        .ticket-header {
            padding: 22px 24px;
            background: #111827;
            border-top: 6px solid #e8a020;
        }

        .header-title {
            margin: 0;
            font-size: 28px;
            line-height: 1.15;
            color: #ffffff;
            font-weight: 800;
        }

        .header-subtitle {
            margin: 8px 0 0;
            color: #d1d5db;
            font-size: 13px;
        }

        .content {
            padding: 20px 24px 16px;
        }

        .info-grid {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .info-grid td {
            width: 50%;
            vertical-align: top;
            padding: 10px 4px;
            border-bottom: 1px solid #f1f5f9;
        }

        .label {
            margin: 0 0 4px;
            color: #6b7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.7px;
        }

        .value {
            margin: 0;
            color: #111827;
            font-size: 14px;
            font-weight: 600;
            word-wrap: break-word;
        }

        .barcode-box {
            margin-top: 16px;
            border: 1px dashed #9ca3af;
            border-radius: 10px;
            padding: 14px;
            background: #f9fafb;
            text-align: center;
        }

        .barcode-label {
            margin: 0 0 8px;
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            letter-spacing: 0.8px;
        }

        .barcode-value {
            margin: 0;
            font-family: DejaVu Sans Mono, monospace;
            font-size: 18px;
            letter-spacing: 4px;
            color: #111827;
            font-weight: 700;
        }

        .ticket-footer {
            padding: 12px 24px 16px;
            color: #6b7280;
            font-size: 11px;
            border-top: 1px solid #f1f5f9;
            background: #fcfcfd;
        }
    </style>
</head>
<body>
    <div class="page-safe">
        <div class="ticket-card">
            <div class="ticket-header">
                <h1 class="header-title">{{ $ticket->event_name }}</h1>
                <p class="header-subtitle">{{ $ticket->venue }}</p>
            </div>

            <div class="content">
                <table class="info-grid" role="presentation">
                    <tr>
                        <td>
                            <p class="label">Event Date</p>
                            <p class="value">{{ $ticket->event_date }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="label">Event Time</p>
                            <p class="value">{{ $ticket->event_time }}</p>
                        </td>
                        <td>
                            <p class="label">Seat / General Admission</p>
                            <p class="value">{{ $ticket->seat ?? 'General Admission' }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <p class="label">Ticket Number</p>
                            <p class="value">{{ $ticket->ticket_number }}</p>
                        </td>
                    </tr>
                </table>

                <div class="barcode-box">
                    <p class="barcode-label">Ticket Verification Code</p>
                    <p class="barcode-value">{{ $ticket->ticket_number }}</p>
                </div>
            </div>

            <div class="ticket-footer">
                Present this ticket at the entrance. Non-transferable.
            </div>
        </div>
    </div>
</body>
</html>