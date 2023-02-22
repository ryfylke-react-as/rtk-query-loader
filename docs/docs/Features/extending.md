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
})
```

It's worth mentioning that queries and transform are linked in this context, meaning that if you supply a new queries argument in the extended loader, but no transform, then you will not inherit the transform from the original loader.

- Supplying just a new `useQueries` argument will result in transform being undefined in practise.
- Supplying just a new `transform` argument will result in the new transform being ignored.
- Supplying a new `transform` and a new `useQueries` argument will properly overwrite the existing base properties.

All other properties in the loader will overwrite as expected. You can, for example, just supply a new `onLoading`, or `onError`.

`.extend` will not merge two separate `useQueries` properties. For example, you cannot _just_ inherit the deferredQueries, you must either inherit all or none of the `useQueries` argument.

:::info
You may extend _extended_ loaders, to create an inheritance model.
:::
