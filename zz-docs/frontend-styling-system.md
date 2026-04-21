# Frontend styling system

## Purpose

Document styling architecture and how styles are composed in live frontend code.

## Current styling stack

- Global stylesheet with tokenized color/type system: `frontend/src/styles/global.css`
- Bootstrap CSS imported globally
- CSS Modules for component/page-level styling
- Theme variables for dark/light scopes via `[data-theme]`

## Real code examples

### Global bootstrap + token setup

```css
@import "bootstrap/dist/css/bootstrap.min.css";

:root {
  --color-main: #0f0f0f;
  --color-accent: #e8a020;
  --font-main: "Noto Sans", sans-serif;
}
```

### Theme override blocks

```css
[data-theme="dark"] {
  --color-main: #0f0f0f;
  --color-text: #ffffff;
}

[data-theme="light"] {
  --color-main: #f5f5f0;
  --color-text: #111111;
}
```

### CSS Modules + utility class composition in TSX

```tsx
<div className={`${styles.layout} ${shouldBlockMainLayout ? styles.pageLoading : ""}`}>
```

```tsx
<div className={`card p-3 p-md-4 ${styles.cartCard}`}>
```

## Style-system notes

- Bootstrap is used primarily for spacing/grid/utility classes.
- CSS Modules provide component-specific visual rules.
- Global `*` rule applies font and base text color app-wide.
- Dynamic module keys are used in primitives (`styles[variant]`, `styles["size-" + size]`).

## Related docs

- [zz-docs/frontend-component-library.md](zz-docs/frontend-component-library.md)
- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
