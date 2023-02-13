---
sidebar_position: 2
---

# Transform

You can transform the queries to any format you'd like.

```ts
const notTransformed = createLoader({
  queries: () => [useGetPokemonsQuery()],
});

type NotTransformedData = InferLoaderData<typeof notTransformed>;
// readonly [UseQueryResults<Pokemon[]>]

const transformed = createLoader({
  queries: () => [useGetPokemonsQuery()],
  transform: (queries) => ({
    results: queries[0].data,
    query: queries[0],
  }),
});

type TransformedData = InferLoaderData<typeof transformed>;
// { results: Pokemon[]; query: UseQueryResult<Pokemon[]>; }
```
