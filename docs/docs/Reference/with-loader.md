---
sidebar_position: 3
---

# `withLoader()`

Wraps a component and provides it with a given `Loader`'s data. Renders the appropriate load/fetch/error states of the loader, and finally the given component when data is loaded successfully.

## Arguments

`withLoader` takes two arguments

- The first argument is a component, but with an extra parameter for the loaded data.
- The second argument is a `Loader` (returned from [`createLoader`](./create-loader.md))

```typescript
type Arg1 = (props: P, loaderData: R) => ReactElement;
type Arg2 = Loader;
```

## Example usage

```tsx
const pokemonLoader = createLoader({
  useQueries: () => ({
    queries: { pokemon: useGetPokemon() },
  }),
});

const Pokemon = withLoader((props, { queries }) => {
  return <div>{queries.pokemon.data.name}</div>;
}, pokemonLoader);
```

Here is another example, where the arguments are all unwrapped:

```tsx
const pokemonLoader = createLoader({
  useQueries: () => ({
    queries: { pokemon: useGetPokemon() },
  }),
});

type PokemonData = InferLoaderData<typeof pokemonLoader>;

const LoadedComponent = (props, loaderData: PokemonData) => {
  return <div>{loaderData.queries.pokemon.data.name}</div>;
};

const Pokemon = withLoader(LoadedComponent, pokemonLoader);
```
