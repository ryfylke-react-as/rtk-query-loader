---
sidebar_position: 1
---

# createLoader

Creates a `Loader`.

## Arguments

All arguments are optional.

- **`useQueries`** - A hook that runs the queries and returns them. It can take an argument, which can be transformed from the consumer props through `queriesArg`
  ```typescript
  useQueries: (arg?: Arg) => {
      queries?: Record<string, UseQueryResult>;
      deferredQueries?: Record<string, UseQueryResult>;
      payload?: any;
  }
  ```
- **`queriesArg`** - A function that transforms the consumer props into the argument for `useQueries` - required if your loader should be able to take arguments from props.
  ```typescript
  queriesArg: (props: Props) => Arg;
  ```
- **`transform`** - A function that lets you transform the shape of the output data.
  ```typescript
  transform: (data: Data) => TransformedData;
  ```
- **`onLoading`** - A function that determines what to render while the component is going through it's initial load phase.
  ```typescript
  onLoading: (props: Props) => ReactElement;
  ```
- **`onError`** - A function that determines what to render while the component is going through it's initial load phase.
  ```typescript
  onError: (props: Props, error: unknown) => ReactElement;
  ```
- **`whileFetching`** - An object that lets you append &/ prepend elements to your component while it is fetching.
  ```typescript
  whileFetching: {
      prepend?: (props: Props, data?: Data) => ReactElement;
      append?: (props: Props, data?: Data) => ReactElement;
  };
  ```
- **`config`** - An object that lets you configure the behavior of the loader.
  ```typescript
  config: {
      defer? {
          shouldThrowError?: boolean;
      };
      loaderComponent?: Component<LoaderComponentProps>;
  }
  ```

## Return

`createLoader` returns a `Loader`. You can use this loader with [withLoader](with-loader.md), or you can call the `.extend` method to produce a new loader using the original loader as a base. `.extend` takes the same set of arguments as `createLoader`.

## Example usage

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
  onLoading: (props) => <LoadingView />,
  onError: (props, error) => <ErrorView />,
  whileFetching: {
    prepend: (props) => <LoadingOverlay />,
  },
});
```

:::caution Using version `0.3.51` or earlier?
Please refer to the [**migration guide**](../Migrations/v0.x).
:::
