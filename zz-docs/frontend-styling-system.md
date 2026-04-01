# Frontend Styling System

## Current Styling Mix

The frontend uses a hybrid styling system:

- Tailwind CSS
- Bootstrap 5
- Custom styles and CSS modules
- UI component libraries (MUI)

This enables fast development but requires discipline to avoid specificity conflicts.

## Practical Rules

1. Use component-scoped styles for page-specific layouts.
2. Use utility classes for spacing and alignment when they remain readable.
3. Reserve global overrides for shared theming only.
4. Avoid deep selector chains that are fragile during refactors.

## Known Pitfalls

- Bootstrap table defaults can override custom table-cell theming.

Recommendation:

- Prefer setting `--bs-table-*` CSS variables on table classes for stable results.

- Dynamic CSS module access can appear unused in static scans.

Recommendation:

- Verify TSX dynamic key usage (`styles[variant]`, `styles[theme]`) before cleanup.

## Design Baseline

Project root README defines primary palette and font direction.

When building new pages:

- Keep color usage consistent with project palette.
- Keep typography hierarchy stable across pages.
- Validate desktop and mobile behavior together.
