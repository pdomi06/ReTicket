# Frontend global loader

## Purpose

Describe the current page-loading system (provider, hooks, overlays, and page integration rules).

## Architecture

- Root provider: `LoadingProvider` in `main.tsx`
- Hook API: `usePageLoading()` and `useIsPageLoading()`
- Global overlay: `PageLoader` in `MainLayout`
- Dashboard-specific overlay: contained `PageLoader` inside dashboard content panel

## Real code examples

### Root registration

```tsx
<LoadingProvider>
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
</LoadingProvider>
```

### Ref-count based loading tracker

```tsx
const activeRequestCountRef = useRef(0);

const incrementLoading = useCallback(() => {
  activeRequestCountRef.current += 1;
  if (activeRequestCountRef.current === 1) {
    setIsPageLoading(true);
  }
}, []);

const decrementLoading = useCallback(() => {
  activeRequestCountRef.current = Math.max(
    0,
    activeRequestCountRef.current - 1,
  );
  if (activeRequestCountRef.current === 0) {
    setIsPageLoading(false);
  }
}, []);
```

### Shared promise wrapper API

```tsx
const trackPageLoading = useCallback(
  async <T,>(promiseOrPromises: Promise<T> | Promise<T>[]) => {
    incrementLoading();

    try {
      if (Array.isArray(promiseOrPromises)) {
        return await Promise.all(promiseOrPromises);
      }

      return await promiseOrPromises;
    } finally {
      decrementLoading();
    }
  },
  [decrementLoading, incrementLoading],
);
```

### Layout-level global overlay behavior

```tsx
const shouldShowGlobalLoader = !isDashboardRoute;
const shouldBlockMainLayout = isPageLoading && shouldShowGlobalLoader;

<PageLoader isEnabled={shouldShowGlobalLoader} />;
```

## Integration notes

- Use global loader for mount-time page fetches.
- Keep action-level loading local (button submits, load-more, row actions).
- Browse sidebar search can suppress global overlay and use in-page loading state.

## Related docs

- [zz-docs/frontend-state-and-api-integration.md](zz-docs/frontend-state-and-api-integration.md)
- [zz-docs/frontend-architecture.md](zz-docs/frontend-architecture.md)
