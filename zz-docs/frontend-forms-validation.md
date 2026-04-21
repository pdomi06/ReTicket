# Frontend forms and validation

## Purpose

Document current client-side form handling and where validation logic lives.

## Current form style

- No centralized form library (Formik/React Hook Form/Zod) in use.
- Validation is page-local with a mix of:
  - `FormData` extraction
  - controlled component state
  - manual guard clauses
  - backend error message passthrough

## Key files

- Login form: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx)
- Register form: [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx)
- Browse sidebar filters: [frontend/src/pages/browse/sidebar/Sidebar.tsx](frontend/src/pages/browse/sidebar/Sidebar.tsx)
- Welcome searchbar: [frontend/src/pages/welcome/searchbar/Searchbar.tsx](frontend/src/pages/welcome/searchbar/Searchbar.tsx)
- Cart checkout form flow: [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx)
- Footer contact form: [frontend/src/components/layout/footer/footer.tsx](frontend/src/components/layout/footer/footer.tsx)

## Real code examples

### Login: FormData extraction + defensive JSON parsing

```tsx
const formData = new FormData(e.currentTarget);
const email = formData.get("email");
const password = formData.get("password");

const rawBody = await response.text();
let data: {
  message?: string;
  data?: { user?: unknown; token?: string };
} | null = null;

try {
  data = rawBody ? JSON.parse(rawBody) : null;
} catch {
  throw new Error("Login endpoint returned non-JSON response.");
}
```

### Browse sidebar: timezone passed with eventDate

```tsx
if (searchForm.eventDate) {
  params.eventDate = searchForm.eventDate;
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes <= 0 ? "+" : "-";
  params.timezone = `${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMins).padStart(2, "0")}`;
}
```

### Footer contact form now has real submit integration

```tsx
const response = await fetch(`${apiBaseUrl}/contact/messages`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    email,
    message,
    source: "footer",
  }),
});
```

## Notable validation gaps

- Login/register still rely heavily on backend validation for semantic constraints.
- `Searchbar.tsx` uses input `name="date"` while state key is `eventDate`.
- Validation UX patterns remain mixed (inline text, arrays, notification, and occasional `alert`).

## Related docs

- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/backend-error-handling.md](zz-docs/backend-error-handling.md)
- [zz-docs/frontend-component-library.md](zz-docs/frontend-component-library.md)
