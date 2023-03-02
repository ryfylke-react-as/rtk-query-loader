---
sidebar-position: 6
---

# Stateful loaders

Since a `Loader` contains a hook, that hook can contain state.

```typescript
const loader = createLoader({
  useQueries: () => {
    const [name, setName] = useState("charizard");
    const pokemon = useGetPokemon(name);
    return {
      queries: {
        pokemon,
      },
    };
  },
});
```

You can then control this state, by sending the handlers through `payload`:

```typescript {10}
const componentLoader = createLoader({
  useQueries: () => {
    const [name, setName] = useState("charizard");
    const debouncedName = useDebounce(name, 200);
    const pokemon = useGetPokemon(debouncedName);
    return {
      queries: {
        pokemon,
      },
      payload: { name, setName },
    };
  },
});

const Component = withLoader((props, loader) => {
  const onChange = (e) => loader.payload.setName(e.target.value);
  // ...
}, componentLoader);
```
