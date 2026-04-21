# Backend queue, jobs, and scheduling

## Purpose

Document current async infrastructure and scheduler behavior in the backend.

## Current status

Queue and scheduling are active in code:

- Default queue connection: `database`
- Queue worker is part of local `composer dev`
- One scheduled command exists: `tickets:release-expired` every 10 minutes
- Dedicated command class exists in `app/Console/Commands`

## Key files

- Queue config: [backend/config/queue.php](backend/config/queue.php)
- Queue tables migration: [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php)
- Console scheduling: [backend/routes/console.php](backend/routes/console.php)
- Reservation cleanup command: [backend/app/Console/Commands/ReleaseExpiredReservations.php](backend/app/Console/Commands/ReleaseExpiredReservations.php)
- Dev runner script: [backend/composer.json](backend/composer.json)

## Real code examples

### Queue default

```php
'default' => env('QUEUE_CONNECTION', 'database'),
```

### Scheduler registration

```php
app(ConsoleKernel::class)->addCommands([
    ReleaseExpiredReservations::class,
]);

Schedule::command('tickets:release-expired')
    ->everyTenMinutes()
    ->withoutOverlapping();
```

### Expired reservation release command

```php
$count = TicketForSale::query()->expired()->update([
    'inBasket' => false,
    'reservationStartedAt' => null,
]);

$this->info("Released {$count} expired reservations.");
```

## Operational notes

- `composer dev` runs `php artisan queue:listen --tries=1`.
- Queue tables are database-backed (`jobs`, `job_batches`, `failed_jobs`).
- The command is scheduler-driven, not a queued job class.
- No additional custom queued jobs are currently present under `app/Jobs`.

## Related docs

- [zz-docs/backend-workflows.md](zz-docs/backend-workflows.md)
- [zz-docs/environment-and-deployment.md](zz-docs/environment-and-deployment.md)
- [zz-docs/local-development-setup.md](zz-docs/local-development-setup.md)
