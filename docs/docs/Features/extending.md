---
sidebar_position: 1
---

# Extend

You can **extend** existing `Loader`s. This lets you inherit and overwrite properties from an existing `Loader`.

```tsx
const parentLoader = createLoader({
    onLoading: () => <div>Loading...</div>
});

const childLoader = parentLoader.extend({
    useQueries: () => ({...}),
    onError: () => <div>Error</div>,
}).extend({
    transform: () => ({...}),
}).extend({
    onLoading: () => <div>Overwritten loading...</div>,
});
```

:::caution
`.extend` will not merge two separate `useQueries` properties. For example, you cannot _just_ inherit the deferredQueries, you must either inherit all or none of the `useQueries` argument.
:::
:::tip Reusable transformers
You can extend as many times as you'd like. You can use this feature to easily inject reusable snippets, like transformers.

```typescript
type QueryRecord = Record<string, UseQueryResult<unknown>>;

export const transformData = {
  transform: (data: {
    queries: QueryRecord;
    deferredQueries: QueryRecord;
    payload: unknown;
  }) => {
    // handle transformation in generic way
  },
};
```

```typescript
const loader = createLoader({...}).extend(transformData);
```

:::
