# Frontend component library

## Scope and current structure

This document describes the reusable frontend component surface currently implemented in the React app.

Primary component folders:

- UI primitives in [frontend/src/components/ui](frontend/src/components/ui).
- Layout wrappers in [frontend/src/components/layout](frontend/src/components/layout).

App-wide composition is handled by [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L8), which wraps routed content with:

- Event context provider.
- Cart context provider.
- Global navbar.
- Conditional footer (hidden on dashboard routes).

## UI primitives

### Button

Implementation: [frontend/src/components/ui/button/Button.tsx](frontend/src/components/ui/button/Button.tsx#L5)

Contract source: [frontend/src/utils/interfaces.ts](frontend/src/utils/interfaces.ts#L207)

Current behavior:

- Supports button mode and link mode through a single component.
- Variant is module-class driven (`primary`, `outline`).
- Disabled link mode renders non-interactive text wrapper instead of a link.

Notes:

- The interface includes optional fields like `className`, `id`, and `name`, but current implementation does not forward these props to rendered elements.

### Input

Implementation: [frontend/src/components/ui/input/Input.tsx](frontend/src/components/ui/input/Input.tsx#L4)

Contract source: [frontend/src/utils/interfaces.ts](frontend/src/utils/interfaces.ts#L186)

Current behavior:

- Floating-label input.
- Theme variants: light and dark.
- Size variants via dynamic module key (`size-small`, `size-medium`, `size-large`).

Notes:

- Controlled and uncontrolled usage are both possible because `value` and `onChange` are optional in the interface.

### Select

Implementation: [frontend/src/components/ui/select/Select.tsx](frontend/src/components/ui/select/Select.tsx#L5)

Contract source: [frontend/src/utils/interfaces.ts](frontend/src/utils/interfaces.ts#L220)

Current behavior:

- Floating-label select.
- Optional first option can be treated as floating label source.
- Theme and size support via dynamic CSS module keys.
- Adds `has-value` style class when a selection exists.

### Textarea

Implementation: [frontend/src/components/ui/textarea/Textarea.tsx](frontend/src/components/ui/textarea/Textarea.tsx#L4)

Contract source: [frontend/src/utils/interfaces.ts](frontend/src/utils/interfaces.ts#L198)

Current behavior:

- Floating-label textarea.
- Theme variants: light and dark.
- Optional row count.

### Modal

Implementation: [frontend/src/components/ui/modal/Modal.tsx](frontend/src/components/ui/modal/Modal.tsx#L14)

Current behavior:

- Controlled visibility via `isOpen`.
- Escape key closes modal.
- Backdrop click closes modal.
- Locks body scroll while open.
- Optional confirm/cancel footer actions using shared Button primitive.
- Size variants: sm, md, lg.

## Data display primitives

### Card

Implementation: [frontend/src/components/ui/card/Card.tsx](frontend/src/components/ui/card/Card.tsx#L5)

Contract source: [frontend/src/utils/interfaces.ts](frontend/src/utils/interfaces.ts#L230)

Current behavior:

- Generic content card with optional image and CTA button.
- Uses Bootstrap card structure combined with module styles.
- CTA is composed through shared Button component.

### Cards

Implementation: [frontend/src/components/ui/cards/Cards.tsx](frontend/src/components/ui/cards/Cards.tsx#L9)

Current behavior:

- Responsive card grid wrapper.
- Computes Bootstrap responsive column classes from `maximumcols`.
- Defaults to four columns on large displays.

## Layout components

### MainLayout

Implementation: [frontend/src/components/layout/MainLayout.tsx](frontend/src/components/layout/MainLayout.tsx#L8)

Responsibilities:

- Wraps all route content from the root route tree.
- Hosts shared providers and global shell elements.
- Hides footer for dashboard routes via pathname check.

### Navbar

Implementation: [frontend/src/components/layout/navbar/navbar.tsx](frontend/src/components/layout/navbar/navbar.tsx#L8)

Responsibilities:

- Primary site navigation.
- Live cart item count from cart context.

Known navigation gap:

- Includes an About link to `/about`, but this route is not currently declared in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40).

### Footer

Implementation: [frontend/src/components/layout/footer/footer.tsx](frontend/src/components/layout/footer/footer.tsx#L9)

Responsibilities:

- Site footer links.
- Embedded contact form composed from Input, Textarea, and Button primitives.

Known navigation gap:

- Footer links to `/privacy`, `/about`, `/contact`, and `/terms`, which are not currently declared routes in [frontend/src/app/router.tsx](frontend/src/app/router.tsx#L40).

## Third-party component usage

### Bootstrap

Bootstrap classes are widely used as structural utilities and component scaffolding alongside CSS Modules.

Examples:

- Card shell in [frontend/src/components/ui/card/Card.tsx](frontend/src/components/ui/card/Card.tsx#L8).
- Grid layout in [frontend/src/components/ui/cards/Cards.tsx](frontend/src/components/ui/cards/Cards.tsx#L15).

### MUI

Current source-level usage is icon-centric rather than full MUI component adoption.

Example icon imports in [frontend/src/pages/welcome/features/Features.tsx](frontend/src/pages/welcome/features/Features.tsx#L2).

## Context as component infrastructure

The reusable layer is not only visual components; app behavior is also standardized through context providers:

- Event context provider in [frontend/src/contexts/event/EventContext.tsx](frontend/src/contexts/event/EventContext.tsx#L5).
- Cart context provider in [frontend/src/contexts/cart/CartContext.tsx](frontend/src/contexts/cart/CartContext.tsx#L5).

These are mounted centrally in MainLayout and provide shared state/actions to components across route pages.

## Current limitations and TBDs

- There is no central design-system package or storybook-style catalog in this repo. TBD whether one is planned.
- Accessibility coverage is partial and component-specific. There is no consolidated a11y test baseline documented in source. TBD.
- Some component contracts in interfaces expose props that are not fully forwarded in implementations (for example Button). This is implementation drift to track during refactors.
