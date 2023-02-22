---
sidebar_position: 4
---

# useCreateQuery

#### **Warning**: This API is experimental and might change.

Lets you use any function that returns a promise in your loader as if it was an RTK useQuery.

```typescript
import {
  createLoader,
  useCreateQuery,
} from "@ryfylke-react/rtk-query-loader";

const getUser = async (userId: string) => {
  const res = await fetch(`users/${userId}`);
  const json = await res.json();
  return json as SomeDataType;
};

const loader = createLoader({
  useQueries: (userId: string) => {
    const query = useCreateQuery(
      async () => await getUser(userId),
      [userId]
    );

    return {
      queries: {
        query,
      },
    };
  },
});
```

:::caution
You lose some great features from RTK query when using `useCreateQuery`.

When possible, try to stick to using actual queries, created from a `@reduxjs/toolkit` API.
You can look at this feature like an escape-hatch that allows you to pass other
data through the loader as well.
:::
