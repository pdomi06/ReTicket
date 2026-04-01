# Frontend forms and validation

## Scope

This document maps current form implementations and validation behavior in the frontend codebase.

It focuses on:

- Form state patterns.
- Client-side validation rules.
- Error-message handling.
- Gaps and inconsistencies that affect UX and maintainability.

## Current form architecture

The project does not currently use a centralized form library such as React Hook Form, Formik, Zod, or Yup in source form logic.

Form handling is implemented manually with React state, `FormData`, and ad-hoc validation checks in page components.

Shared input primitives exist and are reused:

- Input: [frontend/src/components/ui/input/Input.tsx](frontend/src/components/ui/input/Input.tsx#L4)
- Select: [frontend/src/components/ui/select/Select.tsx](frontend/src/components/ui/select/Select.tsx#L5)
- Textarea: [frontend/src/components/ui/textarea/Textarea.tsx](frontend/src/components/ui/textarea/Textarea.tsx#L4)
- Button: [frontend/src/components/ui/button/Button.tsx](frontend/src/components/ui/button/Button.tsx#L5)

## Auth forms

### Login form

Implementation: [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L13)

Validation and submission behavior:

1. Uses `FormData` extraction on submit in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L22).
2. Checks only runtime type of email/password values before request in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L26).
3. Sends POST to `/login` and parses response text as JSON with fallback error if non-JSON in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L31).
4. Displays request errors through local `errors` array state in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L59).

Notes:

- Missing-field feedback for invalid form extraction currently uses `alert(...)` rather than in-form messaging in [frontend/src/pages/login/Login.tsx](frontend/src/pages/login/Login.tsx#L27).
- No explicit email-format validation is performed before submit.

### Register form

Implementation: [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L13)

Validation and submission behavior:

1. Uses `FormData` extraction on submit in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L20).
2. Performs runtime type checks for required fields in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L28).
3. Uses a required checkbox (`required` attribute) for terms acceptance in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L104).
4. Sends POST to `/register` and parses response text as JSON in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L39).
5. Surfaces errors in local `errors` array state in [frontend/src/pages/register/Register.tsx](frontend/src/pages/register/Register.tsx#L73).

Notes:

- No explicit password-strength or password-confirmation equality check on the client side beyond backend response handling.
- Links used in terms/privacy checkbox text point to routes not currently declared in router.

## Search/filter forms

### Welcome search bar

Implementation: [frontend/src/pages/welcome/searchbar/Searchbar.tsx](frontend/src/pages/welcome/searchbar/Searchbar.tsx#L7)

Behavior:

- Uses controlled state object.
- No hard validation; only non-empty values are added to URL query params.
- Navigates to `/browse` with query string in [frontend/src/pages/welcome/searchbar/Searchbar.tsx](frontend/src/pages/welcome/searchbar/Searchbar.tsx#L22).

Notable mismatch:

- Date input is rendered with `name="date"` while state key is `eventDate`, and submission uses `eventDate` in params in [frontend/src/pages/welcome/searchbar/Searchbar.tsx](frontend/src/pages/welcome/searchbar/Searchbar.tsx#L51). This can cause semantic confusion and makes naming inconsistent with other filters.

### Browse sidebar search form

Implementation: [frontend/src/pages/browse/sidebar/Sidebar.tsx](frontend/src/pages/browse/sidebar/Sidebar.tsx#L8)

Behavior:

- Controlled form with `Input` and `Select` components.
- Adds only non-empty values into query params.
- When date is present, appends user timezone offset to query in [frontend/src/pages/browse/sidebar/Sidebar.tsx](frontend/src/pages/browse/sidebar/Sidebar.tsx#L33).
- Navigates to `/browse` with built query string in [frontend/src/pages/browse/sidebar/Sidebar.tsx](frontend/src/pages/browse/sidebar/Sidebar.tsx#L44).

Notes:

- Validation is presence-based only; no numeric range checks for optional filters.

## Cart checkout form

Implementation: [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L6)

Validation behavior:

1. Requires non-empty email in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L53).
2. Uses regex email validation in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L42).
3. Requires non-empty ticket list in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L63).
4. Normalizes and merges backend validation errors from `errors` payload when present in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L85).
5. Displays validation/request outcome via alert-style inline messages (`checkoutError`, `checkoutSuccess`) in [frontend/src/pages/cart/Cart.tsx](frontend/src/pages/cart/Cart.tsx#L180).

This page has the most explicit client-side validation among current forms.

## Dashboard CRUD forms

### Create venue

Implementation: [frontend/src/pages/dashboard/create-venue/CreateVenue.tsx](frontend/src/pages/dashboard/create-venue/CreateVenue.tsx#L8)

Validation behavior:

- Validates presence for `venue` and `section`.
- Validates `rows` and `cols` are integers >= 1 in [frontend/src/pages/dashboard/create-venue/CreateVenue.tsx](frontend/src/pages/dashboard/create-venue/CreateVenue.tsx#L78).
- Validates `rate` is finite and in range 0.1..9.9 in [frontend/src/pages/dashboard/create-venue/CreateVenue.tsx](frontend/src/pages/dashboard/create-venue/CreateVenue.tsx#L82).
- Performs duplicate-venue check before create via API fetch in [frontend/src/pages/dashboard/create-venue/CreateVenue.tsx](frontend/src/pages/dashboard/create-venue/CreateVenue.tsx#L12).
- Uses browser `alert(...)` for success/failure feedback in [frontend/src/pages/dashboard/create-venue/CreateVenue.tsx](frontend/src/pages/dashboard/create-venue/CreateVenue.tsx#L91).

### Edit venue

Implementation: [frontend/src/pages/dashboard/edit-venue/EditVenue.tsx](frontend/src/pages/dashboard/edit-venue/EditVenue.tsx#L9)

Validation behavior:

- Same numeric/range checks as create flow in [frontend/src/pages/dashboard/edit-venue/EditVenue.tsx](frontend/src/pages/dashboard/edit-venue/EditVenue.tsx#L95).
- Uses inline `message` state for success/error display in [frontend/src/pages/dashboard/edit-venue/EditVenue.tsx](frontend/src/pages/dashboard/edit-venue/EditVenue.tsx#L100).

### Create event

Implementation: [frontend/src/pages/dashboard/create-event/CreateEvent.tsx](frontend/src/pages/dashboard/create-event/CreateEvent.tsx#L12)

Validation behavior:

- Converts event date fields to Unix seconds and fails early if conversion returns null in [frontend/src/pages/dashboard/create-event/CreateEvent.tsx](frontend/src/pages/dashboard/create-event/CreateEvent.tsx#L63).
- Uses `toUnixSeconds` utility from [frontend/src/utils/dateTime.ts](frontend/src/utils/dateTime.ts#L3).
- Relies on API responses for most field-level validation (name, location, category, etc.).
- Uses inline `message` state for request-level feedback in [frontend/src/pages/dashboard/create-event/CreateEvent.tsx](frontend/src/pages/dashboard/create-event/CreateEvent.tsx#L140).

### Edit event

Implementation: [frontend/src/pages/dashboard/edit-event/EditEvent.tsx](frontend/src/pages/dashboard/edit-event/EditEvent.tsx#L11)

Validation behavior:

- Same date conversion guard pattern as create event in [frontend/src/pages/dashboard/edit-event/EditEvent.tsx](frontend/src/pages/dashboard/edit-event/EditEvent.tsx#L120).
- Relies on backend for deeper field validation.
- Uses inline `message` state for request-level feedback in [frontend/src/pages/dashboard/edit-event/EditEvent.tsx](frontend/src/pages/dashboard/edit-event/EditEvent.tsx#L193).

## Footer contact form status

Footer renders a contact-style form in [frontend/src/components/layout/footer/footer.tsx](frontend/src/components/layout/footer/footer.tsx#L39), but this form currently has no submit handler or API integration.

Status: UI-only placeholder form (no validation/submit workflow implemented).

## Validation and error-handling patterns summary

Current patterns are mixed:

- FormData extraction: login/register.
- Controlled state: search forms, cart checkout, dashboard CRUD forms.
- Error state arrays: login/register.
- Single message object state: create/edit event and venue.
- Browser alerts: login missing fields and create-venue feedback.

Because patterns differ by page, UX consistency and maintainability are currently medium-risk.

## Known gaps and TBDs

- No shared validation schema layer across forms (TBD whether planned).
- No centralized error-to-UI adapter for backend validation payloads; each page parses differently.
- No unified client-side required-field enforcement strategy (some pages rely on HTML attributes, some rely on JS checks, some rely mostly on backend responses).
- Accessibility validation behavior (for example consistent aria-invalid usage and error field mapping) is not systematically implemented in current source. TBD.
