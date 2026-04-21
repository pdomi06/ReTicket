# Backend file storage

## Purpose

Describe configured storage infrastructure and how files are actually represented in current backend workflows.

## Current state

- Laravel disks are configured (`local`, `public`, `s3`).
- Default disk comes from `FILESYSTEM_DISK` (`local` by default).
- Application flow currently stores ticket file references as URLs in `ticketPdfUrl`.
- No first-class upload API pipeline is implemented in `app/Http/Controllers`.

## Key files

- Filesystem config: [backend/config/filesystems.php](backend/config/filesystems.php)
- Example env: [backend/.env.example](backend/.env.example)
- Original ticket request validation: [backend/app/Http/Requests/StoreOriginalTicketsRequest.php](backend/app/Http/Requests/StoreOriginalTicketsRequest.php)
- Original tickets controller (bulk defaults): [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php)

## Real code examples

### Disk default and disk definitions

```php
'default' => env('FILESYSTEM_DISK', 'local'),

'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
    ],
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
    ],
    's3' => [
        'driver' => 's3',
        // ...
    ],
],
```

### URL-based ticket file contract

```php
'ticketPdfUrl' => ['required', 'string', 'url'],
```

### Bulk generation currently sets empty URL placeholder

```php
$originalTickets[] = [
    'eventId' => $eventId,
    'section' => $venue['section'],
    'row' => $i,
    'seatNumber' => $j,
    'price' => round($basePrice * $venue['rate'], 2),
    'status' => 'pre-release',
    'ticketPdfUrl' => "",
    'created_at' => now(),
    'updated_at' => now(),
];
```

## Notes

- There is a behavior mismatch between single-ticket create (`ticketPdfUrl` required URL) and bulk create (empty string).
- `Storage::` usage is minimal in active business controllers.
- `public/storage` symbolic link mapping is configured and ready for file-serving usage.

## Related docs

- [zz-docs/backend-data-models.md](zz-docs/backend-data-models.md)
- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/environment-and-deployment.md](zz-docs/environment-and-deployment.md)
