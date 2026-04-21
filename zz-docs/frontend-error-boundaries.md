# Frontend error boundaries and runtime failure handling

## Purpose

Describe current runtime error handling strategy in the frontend and boundary/fallback status.

## Current status

- No explicit React error boundary component is implemented.
- No `react-error-boundary` package usage detected.
- Route rendering uses `Suspense` fallback for lazy loading, not crash recovery.

## Real code examples

### Suspense fallback (loading, not error boundary)

```tsx
<Suspense
  fallback={
    <div className={`${loaderStyles.overlay} ${loaderStyles.overlayVisible}`}>
      <LoadingScreen />
    </div>
  }
>
  {useRoutes(routes)}
</Suspense>
```

### Browse async error handling is local state based

```tsx
.catch((err: unknown) => {
  if (err instanceof DOMException && err.name === "AbortError") return;
  const message = err instanceof Error ? err.message : "Failed to load events";
  setError(message);
  setHasMore(false);
  setNextCursor(null);
})
```

### Cart checkout flow catches and displays notification

```tsx
} catch (error) {
  setCheckoutError(error instanceof Error ? error.message : "Checkout failed.");
  setIsCheckingOut(false);
  setCheckoutText("Checkout");
}
```

## Practical implications

- Render-time crashes can bubble to React root without custom fallback UI.
- Most API/runtime failures are handled locally within feature components.
- Error UX is mixed between notifications, inline text, and console logging.

## Related docs

- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/frontend-global-loader.md](zz-docs/frontend-global-loader.md)
