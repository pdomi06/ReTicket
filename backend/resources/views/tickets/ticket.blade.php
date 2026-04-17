<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Event Ticket | Clean Spaced Layout for PDF</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            font-size: 13px;
            color: #111827;
            background: #f1f5f9;
            padding: 28px 20px;
        }

        /* main ticket card – no interactive elements, safe for PDF */
        .ticket-card {
            max-width: 780px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            background: #ffffff;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        /* header with event branding */
        .ticket-header {
            background: #111827;
            border-top: 6px solid #e8a020;
            padding: 26px 28px;
        }

        .header-title {
            color: #ffffff;
            font-size: 30px;
            font-weight: 800;
            letter-spacing: -0.3px;
            margin: 0;
            line-height: 1.2;
        }

        .header-subtitle {
            color: #cbd5e1;
            font-size: 14px;
            margin-top: 8px;
            font-weight: 500;
        }

        /* content area */
        .content {
            padding: 24px 28px 20px;
        }

        /* info table styling */
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            width: 50%;
            vertical-align: top;
            padding: 12px 6px;
            border-bottom: 1px solid #edf2f7;
        }

        .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 600;
            color: #5b6e8c;
            margin-bottom: 6px;
        }

        .value {
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
            line-height: 1.4;
        }

        /* --- SPACIOUS SEAT SECTION: NO BUBBLES, NO HOVER, MAXIMUM GAP --- */
        /* Flex container with generous gap between seat parts */
        .seat-details-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 32px;           /* large, clear spacing between "Section Floor", "Row 1", "Seat 1" */
            align-items: baseline;
            margin-top: 2px;
        }

        /* each seat segment – clean text, no background, no padding, no rounded bubbles.
           Removed all hover effects, transitions, shadows, and dead interactive styles. */
        .seat-part {
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
            line-height: 1.3;
            letter-spacing: normal;
            background: none;
            border-radius: 0;
            padding: 0;
            box-shadow: none;
            backdrop-filter: none;
            display: inline-block;
        }

        /* General admission (single item) – same clean style */
        .seat-part.single-chip {
            background: none;
            color: #0f172a;
            font-weight: 600;
        }

        /* barcode box – clean, no hover effects */
        .barcode-box {
            margin-top: 28px;
            border: 1px dashed #94a3b8;
            border-radius: 20px;
            padding: 18px 12px;
            background: #fafcff;
            text-align: center;
        }

        .barcode-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: 700;
            color: #4b556b;
            margin-bottom: 10px;
        }

        .barcode-value {
            font-family: 'Courier New', 'SF Mono', monospace;
            font-size: 22px;
            letter-spacing: 6px;
            font-weight: 700;
            color: #0b1e33;
            background: #ffffff;
            display: inline-block;
            padding: 6px 16px;
            border-radius: 40px;
        }

        /* footer – simple, non-interactive */
        .ticket-footer {
            padding: 16px 28px 22px;
            font-size: 11px;
            color: #5f6c84;
            border-top: 1px solid #ecf3fa;
            background: #fefefe;
            text-align: center;
            font-weight: 500;
            letter-spacing: 0.3px;
        }

        /* responsive: gap remains comfortable even on narrow screens */
        @media (max-width: 550px) {
            .content {
                padding: 18px 20px;
            }
            .seat-details-wrapper {
                gap: 24px;
            }
            .barcode-value {
                font-size: 18px;
                letter-spacing: 4px;
            }
            .header-title {
                font-size: 24px;
            }
        }

        /* clean border removal for last row */
        .info-table tr:last-child td {
            border-bottom: none;
        }

        /* extra spacing for readability */
        .info-table td:first-child {
            padding-right: 16px;
        }
    </style>
</head>
<body>
    <div class="ticket-card">
        <!-- header: dynamic event & venue -->
        <div class="ticket-header">
            <div class="header-title">{{ $ticket->event_name }}</div>
            <div class="header-subtitle">{{ $ticket->venue }}</div>
        </div>

        <div class="content">
            <table class="info-table">
                <!-- row 1: ticket holder & event date -->
                <tr>
                    <td>
                        <div class="label">Ticket Holder</div>
                        <div class="value">{{ $ticket->ticket_holder ?? $ticket->holder_name ?? 'Ticket Holder' }}</div>
                    </td>
                    <td>
                        <div class="label">Event Date</div>
                        <div class="value">{{ $ticket->event_date }}</div>
                    </td>
                </tr>
                <!-- row 2: event time & SEAT / GENERAL ADMISSION (enhanced spacing, no dead code) -->
                <tr>
                    <td>
                        <div class="label">Event Time</div>
                        <div class="value">{{ $ticket->event_time }}</div>
                    </td>
                    <td>
                        <div class="label">Seat / General Admission</div>
                        <!--
                            ===========================================================
                            SPACIOUS SEAT DISPLAY – LARGE GAP (32px) BETWEEN ELEMENTS
                            Removed all hover, transitions, background bubbles.
                            Splits "Section Floor | Row 1 | Seat 1" into separate pieces.
                            ===========================================================
                        -->
                        <div class="value seat-details-wrapper">
                            @php
                                // Get seat info: fallback to 'General Admission' if null/empty
                                $rawSeat = $ticket->seat ?? null;
                                $seatInfo = (!empty($rawSeat) || $rawSeat === '0') ? $rawSeat : 'General Admission';
                                
                                $seatParts = [];
                                
                                // if seat info contains pipe separator (e.g., "Section Floor | Row 1 | Seat 1")
                                // split into clean segments for maximum visual spacing
                                if (is_string($seatInfo) && strpos($seatInfo, '|') !== false) {
                                    $rawParts = explode('|', $seatInfo);
                                    $seatParts = array_map('trim', $rawParts);
                                    // remove empty segments if any
                                    $seatParts = array_filter($seatParts, function($part) {
                                        return $part !== '';
                                    });
                                    $seatParts = array_values($seatParts);
                                } else {
                                    // plain seat string (e.g., "General Admission" or "Section Floor Row 1 Seat 1")
                                    // keep as a single unit for clarity
                                    $seatParts = [$seatInfo];
                                }
                            @endphp

                            @forelse($seatParts as $index => $segment)
                                <!-- each seat detail is plain text with generous gap (32px) – no bubble background, no hover -->
                                <span class="seat-part {{ count($seatParts) === 1 ? 'single-chip' : '' }}">
                                    {{ $segment }}
                                </span>
                            @empty
                                <!-- ultimate fallback -->
                                <span class="seat-part single-chip">General Admission</span>
                            @endforelse
                        </div>
                    </td>
                </tr>
            </table>

            <!-- barcode section with ticket verification code -->
            <div class="barcode-box">
                <div class="barcode-label">Ticket Verification Code</div>
                <div class="barcode-value">{{ $ticket->ticket_number }}</div>
            </div>
        </div>

        <div class="ticket-footer">
            ✦ Present this ticket at the entrance. Non-transferable. ✦
        </div>
    </div>
</body>
</html>