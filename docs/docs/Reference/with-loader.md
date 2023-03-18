---
sidebar_position: 1
---

# withLoader

Consumes a `Loader`.

## Arguments

`withLoader` takes two arguments.

```typescript
type Argument1 = (props: P, loaderData: R) => ReactElement;
type Argument2 = Loader;
```

- The first argument is a component, but with an extra parameter for the loaded data.
- The second argument is a `Loader` (returned from `createLoader`)

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
