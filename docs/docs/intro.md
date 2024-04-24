---
sidebar_position: 1
slug: /
title: Introduction
---

# RTK Query Loader

> Create _loaders_ for your React components.

🔗 **Extendable**
💫 **Transformable**
♻️ **Reusable**
✅ **Properly typed**

You write your components, as if the data has already loaded.

## Install

```shell
npm i @ryfylke-react/rtk-query-loader
```

## Example

```tsx
type Props = {
  name: string;
};

// Creating a loader
const loader = createLoader({
  queriesArg: (props: Props) => props.name,
  useQueries: (name) => ({
    queries: {
      pokemon: useGetPokemonQuery(name),
    },
  }),
});

// Consuming the loader
const Pokemon = withLoader((props, { queries }) => {
  return (
    <article>
      <h1>{queries.pokemon.data.name}</h1>
      <div>{/* ... */}</div>
    </article>
  );
}, loader);
```

## Playground

<iframe 
    src="https://codesandbox.io/embed/ryfylke-react-rtk-query-loader-demo-du3936?codemirror=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fpokemon%2FPokemon.tsx&theme=dark"
    style={{width: "100%", height: 600, marginBottom: "1rem"}}
    title="@ryfylke-react/rtk-query-loader Demo"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
