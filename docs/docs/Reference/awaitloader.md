---
sidebar_position: 5
---

# `<AwaitLoader />`

> **New in version 1.0.4**

AwaitLoader is a component that consumes a loader and then renders the proper load/fetch/error states, and `props.render` on success.

## Arguments

- **`loader`** - The loader that contains the queries you want to await.
- **`render`** - A function that recieves the loader data and should return a ReactElement.
- **`args`** - Takes in the expected props for the given loader.

```tsx
const loader = createLoader({
  queriesArg: (props: { name: string }) => props.name,
  useQueries: (name) => ({
    queries: {
      pokemon: useGetPokemonQuery(name),
    },
  }),
});

const App = () => {
  return (
    <div>
      <AwaitLoader
        loader={loader}
        args={{ name: "charizard" }}
        render={(data) => (
          <pre>{JSON.stringify(data.queries.pokemon.data)}</pre>
        )}
      />
      <AwaitLoader
        loader={loader}
        args={{ name: "pikachu" }}
        render={(data) => (
          <pre>{JSON.stringify(data.queries.pokemon.data)}</pre>
        )}
      />
    </div>
  );
};
```
