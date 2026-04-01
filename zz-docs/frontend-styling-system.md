# Frontend styling system

## Current styling architecture

The current frontend styling stack is primarily:

- CSS Modules for component/page scoped styles.
- Bootstrap CSS utilities and component classes, imported globally.
- A small amount of global CSS reset/theme behavior in one shared stylesheet.

Evidence:

- Bootstrap is globally imported in [frontend/src/styles/global.css](frontend/src/styles/global.css#L1) and that file is loaded in [frontend/src/main.tsx](frontend/src/main.tsx#L4).
- CSS Modules are used throughout UI primitives and pages, for example [frontend/src/components/ui/button/Button.tsx](frontend/src/components/ui/button/Button.tsx#L3), [frontend/src/components/ui/input/Input.tsx](frontend/src/components/ui/input/Input.tsx#L2), and [frontend/src/components/ui/select/Select.tsx](frontend/src/components/ui/select/Select.tsx#L2).
- The workspace currently contains many module stylesheets under [frontend/src](frontend/src), including paths like [frontend/src/components/ui/button/Button.module.css](frontend/src/components/ui/button/Button.module.css) and [frontend/src/pages/dashboard/Dashboard.module.css](frontend/src/pages/dashboard/Dashboard.module.css).

## How styles are composed in components

The project regularly composes Bootstrap classes and CSS Module classes in the same JSX element.

Examples:

- In the card component, Bootstrap `card` is combined with module class `style['card']` in [frontend/src/components/ui/card/Card.tsx](frontend/src/components/ui/card/Card.tsx#L8).
- In carousel markup, Bootstrap carousel classes are used alongside module-scoped image/header classes in [frontend/src/pages/welcome/carouser/Carouser.tsx](frontend/src/pages/welcome/carouser/Carouser.tsx#L8).
- Responsive Bootstrap grid class names are generated dynamically in [frontend/src/components/ui/cards/Cards.tsx](frontend/src/components/ui/cards/Cards.tsx#L12) and [frontend/src/components/ui/cards/Cards.tsx](frontend/src/components/ui/cards/Cards.tsx#L13).

This composition pattern is a real project convention and should be preserved in documentation and refactors.

## Dynamic CSS Module keys

Several components compute module class names dynamically, which can look unused in static scans:

- `styles[variant]` in [frontend/src/components/ui/button/Button.tsx](frontend/src/components/ui/button/Button.tsx#L9).
- `styles["size-" + size]` in [frontend/src/components/ui/input/Input.tsx](frontend/src/components/ui/input/Input.tsx#L7).
- `style[theme]` and ``style[`size-${size}`]`` in [frontend/src/components/ui/select/Select.tsx](frontend/src/components/ui/select/Select.tsx#L31) and [frontend/src/components/ui/select/Select.tsx](frontend/src/components/ui/select/Select.tsx#L32).

Maintenance note:

- Avoid deleting module selectors purely because they do not appear as literal strings in TSX.

## Global style side effects

The global stylesheet applies a universal selector rule in [frontend/src/styles/global.css](frontend/src/styles/global.css#L17).

Impact:

- Typography and text color defaults are forced broadly across elements.
- Third-party and Bootstrap component defaults can be unintentionally overridden.

Recommendation:

- Keep global rules limited to true app-wide defaults.
- Prefer module-level overrides for page/component-specific design adjustments.

## Tailwind and MUI status

Tailwind packages exist in dependencies (for example [frontend/package.json](frontend/package.json#L19) and [frontend/package.json](frontend/package.json#L29)), but this pass did not find active Tailwind directive/class usage in the frontend source files.

MUI packages are present in dependencies ([frontend/package.json](frontend/package.json#L16), [frontend/package.json](frontend/package.json#L17)), but styling in this codebase is still mainly Bootstrap + CSS Modules.

If Tailwind is intended to be active, this is currently TBD until integration points are added in `src` (for example framework directives or class usage).

## Known risks and guardrails

- Bootstrap interactive components may need Bootstrap JS wiring; carousel markup currently uses Bootstrap data attributes in [frontend/src/pages/welcome/carouser/Carouser.tsx](frontend/src/pages/welcome/carouser/Carouser.tsx#L10), [frontend/src/pages/welcome/carouser/Carouser.tsx](frontend/src/pages/welcome/carouser/Carouser.tsx#L37), and [frontend/src/pages/welcome/carouser/Carouser.tsx](frontend/src/pages/welcome/carouser/Carouser.tsx#L41).
- Mixed global/module/bootstrap styling can create specificity drift during refactors.
- Dynamic class key patterns require careful review before CSS cleanup.

## Practical guidance for new UI work

- Default to CSS Modules for component/page-specific styling.
- Use Bootstrap classes for layout and utility concerns where it improves speed and clarity.
- Keep global stylesheet changes minimal and intentional.
- When introducing style variants, follow existing dynamic key patterns and ensure matching selectors exist in the module CSS.
