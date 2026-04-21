# Frontend component library

## Purpose

Inventory reusable UI/layout components and their current contracts.

## Component groups

- UI primitives: `frontend/src/components/ui/*`
- Layout shell: `frontend/src/components/layout/*`
- Loading components: `frontend/src/components/loading/*`
- Auth guard component: `frontend/src/components/auth/RequireAuth.tsx`

## Key primitives

- Button: supports action button mode and route-link mode
- Input/Select/Textarea: floating-label style controls with theme/size variants
- Modal: controlled open/close with ESC/backdrop dismiss
- Notification: inline user feedback messages
- Card/Cards: reusable event/content card patterns

## Real code examples

### Button dual mode (link vs button)

```tsx
if (link) {
  return (
    <div className={styles["button-link"]}>
      <Link to={link} className={`${styles.button} ${styles[variant]}`}>
        {text}
      </Link>
    </div>
  );
}

return (
  <button
    type={type}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
  >
    {text}
  </button>
);
```

### Select floating-label behavior

```tsx
const usesFirstOptionAsLabel = !!firstOptionElement;
const floatingLabel =
  firstOptionElement && typeof firstOptionElement.props.children === "string"
    ? firstOptionElement.props.children
    : label;
```

### Footer reusable form + notification components

```tsx
<form className={styles["footer-form"]} onSubmit={handleSubmit}>
  <Input type="email" name="footer-email" label="Email Address" theme="dark" />
  <Textarea name="footer-message" label="Your Message" rows={4} theme="dark" />
  <Button
    type="submit"
    text={isSubmitting ? "Sending..." : "Send Message"}
    disabled={isSubmitting}
  />
  {formState ? (
    <Notification text={formState.text} variant={formState.type} />
  ) : null}
</form>
```

## Layout components

- `MainLayout` hosts `Navbar`, `Outlet`, and conditional `Footer`.
- Dashboard route renders its own sidebar/content shell and contained page loader.
- `PageLoader` + `LoadingScreen` provide unified async loading visuals.

## Notes

- Footer/nav links to `/about`, `/contact`, `/privacy`, `/terms` are now matched by real routes.
- Component styling is mostly CSS Modules with shared color/font tokens from `global.css`.
- Most primitives are intentionally lightweight and close to raw HTML semantics.

## Related docs

- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
- [zz-docs/frontend-styling-system.md](zz-docs/frontend-styling-system.md)
- [zz-docs/frontend-forms-validation.md](zz-docs/frontend-forms-validation.md)
