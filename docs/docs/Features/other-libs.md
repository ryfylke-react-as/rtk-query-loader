---
sidebar_position: 4
---

# Use with other libraries

You can use RTK Query Loader with most other similar query-fetching libraries. This is possible through the use of _resolvers_.

:::note
Although `rtk-query-loader` was build with `@reduxjs/toolkit` in mind, the underlying principles can be applied to any similar data loading solution. [Read more about how RTK Query Loader works under the hood](../Advanced/under-the-hood.md).
:::

## Tanstack Query

```typescript
import {
  useQuery,
  UseQueryResult as TanstackUseQueryResult,
  UseQueryOptions,
} from "@tanstack/react-query";

const tanstackResolver = <T extends unknown>(
  query: TanstackUseQueryResult<T>
): UseQueryResult<T> & {
  orignal_query: TanstackUseQueryResult<T>;
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

## Other libraries

If you are interested in creating resolvers for other libraries, you can [edit this page](https://github.com/ryfylke-react-as/rtk-query-loader/tree/main/docs/docs/Advanced/other-libs.md) and then [submit a pull request](https://github.com/ryfylke-react-as/rtk-query-loader/compare) on GitHub to share your resolver here, as an npm package, or with the code embedded directly in the docs.
