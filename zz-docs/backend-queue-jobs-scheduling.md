# Backend queue, jobs, and scheduling

## Purpose

Document how asynchronous processing is configured in the backend and what is currently implemented in application code.

## Overview

Queue infrastructure is configured, but application-level usage is minimal at this time.

- Default queue connection is `database` in [backend/config/queue.php](backend/config/queue.php#L16).
- Example environment sets `QUEUE_CONNECTION=database` in [backend/.env.example](backend/.env.example#L39).
- Queue tables (`jobs`, `job_batches`, `failed_jobs`) are present via migration in [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L14).
- Local dev script runs a queue listener in [backend/composer.json](backend/composer.json#L50).
- No custom job classes were found under `app/Jobs`, and no `dispatch(...)` usage was found under `backend/app/**`.
- No scheduled tasks were found in app code; `routes/console.php` currently contains only the default `inspire` command.

## Key files and locations

- Queue connection config: [backend/config/queue.php](backend/config/queue.php#L16)
- Queue env default: [backend/.env.example](backend/.env.example#L39)
- Queue tables migration: [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L14)
- Dev process includes queue listener: [backend/composer.json](backend/composer.json#L50)
- Console command file (no scheduler definitions): [backend/routes/console.php](backend/routes/console.php#L1)

## Patterns and conventions

### Queue driver and connections

- App default queue driver is environment-driven with fallback `database`: [backend/config/queue.php](backend/config/queue.php#L16).
- Configured connection options include:
  - `sync`: [backend/config/queue.php](backend/config/queue.php#L30)
  - `database`: [backend/config/queue.php](backend/config/queue.php#L34)
  - `beanstalkd`: [backend/config/queue.php](backend/config/queue.php#L43)
  - `sqs`: [backend/config/queue.php](backend/config/queue.php#L51)
  - `redis`: [backend/config/queue.php](backend/config/queue.php#L62)
  - `deferred`, `background`, `failover`: [backend/config/queue.php](backend/config/queue.php#L70)

### Failed jobs and batches

- Batch metadata table is configured as `job_batches`: [backend/config/queue.php](backend/config/queue.php#L93).
- Failed jobs use `database-uuids` driver by default: [backend/config/queue.php](backend/config/queue.php#L110).
- Migration creates:
  - `jobs`: [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L14)
  - `job_batches`: [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L24)
  - `failed_jobs`: [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L37)

### Runtime pattern in this repository

- Queue worker is expected during local development via `php artisan queue:listen --tries=1` in the `composer dev` script: [backend/composer.json](backend/composer.json#L50).
- No in-repo application jobs, queued listeners, or explicit dispatch calls were found in `backend/app/**` during documentation scan.
- This means queue infrastructure is present but currently lightly used by project code.

### Scheduling status

- No scheduled tasks were found (no `Schedule::...` definitions in app code).
- `routes/console.php` contains only the default `inspire` command in [backend/routes/console.php](backend/routes/console.php#L6).
- Scheduler operation strategy for production is therefore TBD.

## Examples (real code)

### Example 1: Default queue backend

- Queue default: `env('QUEUE_CONNECTION', 'database')` in [backend/config/queue.php](backend/config/queue.php#L16).
- Example env value: `QUEUE_CONNECTION=database` in [backend/.env.example](backend/.env.example#L39).

### Example 2: Database queue schema

- `jobs` table schema starts in [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L14).
- `failed_jobs` table schema starts in [backend/database/migrations/0001_01_01_000002_create_jobs_table.php](backend/database/migrations/0001_01_01_000002_create_jobs_table.php#L37).

### Example 3: Dev runner process

- Dev script includes queue listener process in [backend/composer.json](backend/composer.json#L50).

### Example 4: Scheduler currently absent

- Console routes file defines only `inspire` command, no scheduled task definitions: [backend/routes/console.php](backend/routes/console.php#L6).

## Gotchas and known issues

- Queue is configured and worker command is part of local dev scripts, but no confirmed app-level job dispatches were found.
- `queue:listen --tries=1` retries failed jobs only once in local dev script; this may differ from future production worker settings.
- Because no scheduler tasks are defined, cron-driven automation is currently absent in repository code.
- Production queue worker orchestration (Supervisor/systemd/container process model) is not documented in repo and remains TBD.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/environment-and-deployment.md](zz-docs/environment-and-deployment.md)
- [zz-docs/local-development-setup.md](zz-docs/local-development-setup.md)
- [zz-docs/troubleshooting.md](zz-docs/troubleshooting.md)
