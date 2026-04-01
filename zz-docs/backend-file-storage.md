# Backend file storage

## Purpose

Document how file storage is configured and actually used in the current Laravel backend.

## Overview

The backend has Laravel filesystem disks configured, but active application code currently does not implement a file upload/download pipeline.

- Default disk is `local` via environment config in [backend/config/filesystems.php](backend/config/filesystems.php#L16).
- `.env.example` sets `FILESYSTEM_DISK=local` in [backend/.env.example](backend/.env.example#L38).
- `public` and `s3` disks are configured as options in [backend/config/filesystems.php](backend/config/filesystems.php#L35) and [backend/config/filesystems.php](backend/config/filesystems.php#L50).
- Ticket documents are represented as URL strings (`ticketPdfUrl`) in model/validation/schema, not as uploaded files managed by `Storage`.

## Key files and locations

- Filesystem configuration: [backend/config/filesystems.php](backend/config/filesystems.php#L1)
- Environment defaults: [backend/.env.example](backend/.env.example#L38)
- Original ticket schema field for PDF URL: [backend/database/migrations/2026_01_22_024358_create_original_tickets_table.php](backend/database/migrations/2026_01_22_024358_create_original_tickets_table.php#L24)
- Original ticket validation requires URL format: [backend/app/Http/Requests/StoreOriginalTicketsRequest.php](backend/app/Http/Requests/StoreOriginalTicketsRequest.php#L31)
- Original ticket model stores `ticketPdfUrl`: [backend/app/Models/OriginalTicket.php](backend/app/Models/OriginalTicket.php#L27)
- Search/filter by `ticketPdfUrl`: [backend/app/Http/Requests/SearchOriginalTicketsRequest.php](backend/app/Http/Requests/SearchOriginalTicketsRequest.php#L31), [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L64)

## Patterns and conventions

### Configured disks

- `local` disk
  - Driver: `local`
  - Root: `storage/app/private`
  - Config: [backend/config/filesystems.php](backend/config/filesystems.php#L29)
- `public` disk
  - Driver: `local`
  - Root: `storage/app/public`
  - Public URL: `APP_URL/storage`
  - Config: [backend/config/filesystems.php](backend/config/filesystems.php#L35)
- `s3` disk
  - Driver: `s3`
  - Uses AWS env vars (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`, etc.)
  - Config: [backend/config/filesystems.php](backend/config/filesystems.php#L50)

### Default behavior

- Default disk is environment-driven (`FILESYSTEM_DISK`) with fallback `local`: [backend/config/filesystems.php](backend/config/filesystems.php#L16).
- Current example environment keeps local as default: [backend/.env.example](backend/.env.example#L38).

### Public storage link

- Symbolic link mapping is configured from `public/storage` to `storage/app/public`: [backend/config/filesystems.php](backend/config/filesystems.php#L79).
- `public/storage` is gitignored: [backend/.gitignore](backend/.gitignore#L18).

### Current app-level usage pattern

- No application-level `Storage::` usage was found under `backend/app/**`.
- Ticket documents are handled as externally hosted URLs, validated as URL strings, and stored directly in DB fields.
- Bulk ticket creation currently sets `ticketPdfUrl` to an empty string placeholder in [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L123) and [backend/app/Http/Controllers/OriginalTicketsController.php](backend/app/Http/Controllers/OriginalTicketsController.php#L155).

## Examples (real code)

### Example 1: Default disk selection

- Config expression: `env('FILESYSTEM_DISK', 'local')` in [backend/config/filesystems.php](backend/config/filesystems.php#L16).
- Example environment value: `FILESYSTEM_DISK=local` in [backend/.env.example](backend/.env.example#L38).

### Example 2: URL-based ticket document contract

- Create request requires `ticketPdfUrl` as `string|url` in [backend/app/Http/Requests/StoreOriginalTicketsRequest.php](backend/app/Http/Requests/StoreOriginalTicketsRequest.php#L31).
- Search request supports `ticketPdfUrl` filtering in [backend/app/Http/Requests/SearchOriginalTicketsRequest.php](backend/app/Http/Requests/SearchOriginalTicketsRequest.php#L31).
- Database column is text in [backend/database/migrations/2026_01_22_024358_create_original_tickets_table.php](backend/database/migrations/2026_01_22_024358_create_original_tickets_table.php#L24).

### Example 3: Public link mapping

- Filesystem links array maps `public/storage` => `storage/app/public` in [backend/config/filesystems.php](backend/config/filesystems.php#L79).

## Gotchas and known issues

- Storage infrastructure is configured, but application code does not currently upload or retrieve files through Laravel `Storage` APIs.
- `ticketPdfUrl` is required for single-ticket create requests, but bulk create currently writes an empty string for this field; this is a behavior mismatch to be aware of.
- S3 is configured but not active by default because `FILESYSTEM_DISK` is set to `local` in example env.
- No verified endpoint currently exposes signed URLs, upload presign flows, or file lifecycle management (delete/archive).
- Exact production disk choice is TBD and depends on runtime environment variables.

## Related docs

- [zz-docs/backend-architecture.md](zz-docs/backend-architecture.md)
- [zz-docs/backend-data-models.md](zz-docs/backend-data-models.md)
- [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md)
- [zz-docs/environment-and-deployment.md](zz-docs/environment-and-deployment.md)
