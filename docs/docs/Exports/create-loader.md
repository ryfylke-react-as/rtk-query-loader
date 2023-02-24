---
sidebar_position: 1
---

# createLoader

Creates a `Loader`.

```typescript title="example.ts"
type ConsumerProps = Record<string, any> & {
  userId: string;
};

const loader = createLoader({
  queriesArg: (props: ConsumerProps) => props.userId,
  useQueries: (userId) => {
    return {
      queries: {
        user: useGetUser(userId),
      },
      deferredQueries: {
        relations: useGetUserRelations(userId),
      },
      payload: {
        // Lets you send any static data to your consumer
        static: "data",
      },
    };
  },
  transform: (loaderData) => ({
    ...loaderData,
    foo: "bar",
  }),
  onLoading: (props) => <div>Loading...</div>,
  onError: (props, error) => <div>Error!</div>,
  whileFetching: {
    prepend: (props) => <LoadingSpinner />,
  },
});
```

A `Loader` takes ownership over...

- Data-loading
- Data-transformation
- Fetch-state rendering

:::caution Using version `0.3.51` or earlier?
Please refer to the [**migration guide**](../Migrations/v0.x).
:::
