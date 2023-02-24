---
sidebar_position: 3
---

# Deferring queries

Say you have a query that takes a long time to resolve. You want to put it in the loader, to co-locate it with the rest of your queries, but you don't want it to affect the loading state and postpone the initial load of the component. This is where `deferredQueries` comes in.

## Example

```typescript {3-13}
const loader = createLoader({
  useQueries: () => {
    const importantQuery = useImportantQuery();
    const slowQuery = useSlowQuery();

    return {
      queries: {
        importantQuery,
      },
      deferredQueries: {
        slowQuery,
      },
    };
  },
  transform: (loader) => ({
    important: loader.queries.importantQuery.data, // ImportantQueryResponse
    slow: loader.deferredQueries.slowQuery.data, // SlowQueryResponse | undefined
  }),
});
```

Deferred queries

- Do not affect the loading state
- Cause the component to rerender when fulfilled
