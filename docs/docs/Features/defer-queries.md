---
sidebar_position: 3
---

# Deferring queries

Say you have a query that takes a long time to resolve. You want to put it in the loader, to co-locate it with the rest of your queries, but you don't want it to affect the loading state and postpone the initial load of the component. This is where `deferredQueries` comes in.

## Example

```typescript {3-7}
const loader = createLoader({
  queries: () => [useImportantQuery()] as const,
  deferredQueries: () => [useSlowQuery()] as const,
  transform: (queries, deferred) => ({
    important: queries[0].data,
    slow: deferred[0].data,
  }),
});
```

Deferred queries are not automatically passed to the output of the loader, you have to use the `transform` argument (and it's second argument) to expose the queries for the consumers. The format of how you transform it is not important, but it is the only way to _get_ the deferred query result out of the loader.

Deferred queries

- Do not affect the loading state
- Are only exposed through `transform`
- Cause the component to rerender when fulfilled
