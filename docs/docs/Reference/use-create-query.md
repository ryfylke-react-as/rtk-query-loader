---
sidebar_position: 2
---

# `useCreateQuery()`

Lets you use any function that returns a promise to load your component.

## Arguments

`useCreateQuery` takes two arguments:

- The first argument is a function that returns a promise.
- The second argument is a dependency array. Whenever a value in this array changes, the query is re-run.

## Example usage

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
You lose some great features from RTK query when using `useCreateQuery`, like global query invalidation (beyond the dependency array), request cancellation and caching.
:::
