---
sidebar_position: 2
---

# Transform

You can transform the queries to any format you'd like.

```ts
const notTransformed = createLoader({
  useQueries: () => ({
    queries: { pokemons: useGetPokemonsQuery() },
  }),
});

type NotTransformedData = InferLoaderData<typeof notTransformed>;
// { queries: { pokemons: UseQueryResult<Pokemon[]> } }

const transformed = createLoader({
  useQueries: () => ({
    queries: { pokemons: useGetPokemonsQuery() },
  }),
  transform: (loader) => ({
    results: loader.queries.pokemons.data,
    query: loader.queries.pokemons,
  }),
});

type TransformedData = InferLoaderData<typeof transformed>;
// { results: Pokemon[]; query: UseQueryResult<Pokemon[]>; }
```
