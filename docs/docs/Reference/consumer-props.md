---
sidebar_position: 6
---

# `ConsumerProps<>`

Helper for typing your expected consumer props for the loader.

```typescript {1-3,6}
type PokemonLoaderProps = ConsumerProps<{
  name: string;
}>;

const pokemonLoader = createLoader({
  queriesArg: (props: PokemonLoaderProps) => props.name,
  useQueries: (name) => ({
    queries: { pokemon: useGetPokemon(name) },
  }),
});

// pokemonLoader can now we used by any component
// that accepts a prop `name` of type `string`.

type PokemonComponentProps = {
  name: string;
  size: number;
}; // ✅

type OtherPokemonComponentProps = {
  name: string;
}; // ✅

type IncompatibleProps = {
  pokemonName: string;
}; // ❌
```
