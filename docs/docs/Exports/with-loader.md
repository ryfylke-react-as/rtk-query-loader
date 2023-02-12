---
sidebar_position: 1
---

# withLoader

Consumes a `Loader`.

Takes two arguments:

```typescript
type Argument1 = (props: P, loaderData: R) => ReactElement;
type Argument2 = Loader; // Return type of `createLoader`
```

Example:

```tsx
const Component = withLoader(
  (props, queries) => <div />,
  createLoader({})
);
```
