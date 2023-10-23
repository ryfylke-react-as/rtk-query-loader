---
sidebar_position: 4
---

# Use with other libraries

You can use RTK Query Loader with most other similar query-fetching libraries. This is possible through the use of _resolvers_.

:::note
Although `rtk-query-loader` was build with `@reduxjs/toolkit` in mind, the underlying principles can be applied to any similar data loading solution.
:::

## Tanstack Query

[See example on CodeSandbox](https://codesandbox.io/s/tanstack-query-rtk-query-loader-example-6393w2)

```typescript
import { useQueryResult } from "@ryfylke-react/rtk-query-loader";
import {
  useQuery,
  UseQueryResult as TanstackUseQueryResult,
  UseQueryOptions,
} from "@tanstack/react-query";

const tanstackResolver = <T extends unknown>(
  query: TanstackUseQueryResult<T>
): UseQueryResult<T> & {
  original_query: TanstackUseQueryResult<T>;
} => ({
  isLoading: query.isLoading,
  isFetching: query.isFetching,
  isSuccess: query.isSuccess,
  isError: query.isError,
  error: query.error,
  data: query.data,
  isUninitialized: !query.isFetchedAfterMount,
  originalArgs: null,
  refetch: () => query.refetch(),
  currentData: query.data,
  endpointName: undefined,
  original_query: query,
});

const useTanstackQuery = <T extends unknown>(
  args: UseQueryOptions<T>
) => tanstackResolver(useQuery(args));
```

This is how you would use it:

```typescript
import { useTanstackQuery } from "../loader-resolvers";

const loader = createLoader({
  useQueries: () => {
    const repoData = useTanstackQuery({
      queryKey: ["repoData"],
      queryFn: () =>
        fetch(
          "https://api.github.com/repos/ryfylke-react-as/rtk-query-loader"
        ).then((res) => res.json() as Promise<RepoDataResponse>),
    });

    return {
      queries: {
        repoData,
      },
    };
  },
});
```

The output format will obviously be a bit different, but in this example you have access to the original query at the `.original_query` property.

## SWR

```typescript
import { UseQueryResult } from "@ryfylke-react/rtk-query-loader";
import useSWR, { SWRResponse, Key } from "swr";

const swrResolver = <TRes>(res: SWRResponse<TRes>): UseQueryResult<TRes> => {
  const q = {
    data: res.data,
    isError: res.error ? true : false,
    isLoading: res.isLoading,
    isFetching: res.isLoading && res.data !== undefined,
    isSuccess: res.data ? (res.error ? false : true) : false,
    startedTimeStamp: new Date().getTime(),
    isUninitialized: !res.isLoading && !res.data,
    refetch: () => {
      res.mutate();
    },
    currentData: res.data,
    endpointName: "unknown",
    originalArgs: "unknown",
    requestId: "unknown",
    error: res.error,
    fulfilledTimeStamp: new Date().getTime()
  };
  console.log(q);
  return q;
};

export const useSWRQuery = <TRes, TArgs extends Key>(
  key: TArgs,
  fetcher: (args: TArgs) => Promise<TRes>
) => {
  return swrResolver(useSWR(key, fetcher));
};
```

This is how you would use it:

```typescript
import { useTanstackQuery } from "../loader-resolvers";

const loader = createLoader({
  useQueries: (pokemonName?: string) => {
    const pokemon = useSWRQuery(pokemonName ?? "charizard", getPokemon);

    return {
      queries: {
        pokemon,
      },
    };
  },
});
```

## Other libraries

If you are interested in creating resolvers for other libraries, you can [edit this page](https://github.com/ryfylke-react-as/rtk-query-loader/tree/main/docs/docs/Advanced/other-libs.md) and then [submit a pull request](https://github.com/ryfylke-react-as/rtk-query-loader/compare) on GitHub to share your resolver here, as an npm package, or with the code embedded directly in the docs.

## Use with promises

If you want to use RTK Query Loader with promises, you can read more about that on the [`useCreateQuery` reference page](../Reference/use-create-query.md).
