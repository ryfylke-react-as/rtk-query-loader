---
sidebar_position: 5
---

# Custom `loaderComponent`

You could pass a custom `loaderComponent` to your loaders, if you'd like:

```typescript
const CustomLoader = (props: CustomLoaderProps) => {
  // Handle rendering
};

const loader = createLoader({
  loaderComponent: CustomLoader,
  // ...
});
```

:::tip
This allows you to have really fine control over how the rendering of components using `withLoader` should work.
:::
