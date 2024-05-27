![RTK Query Loader](https://user-images.githubusercontent.com/1190770/233955284-a7da801e-ff3f-4fdc-9808-8f1e5a829012.png)

![npm](https://img.shields.io/npm/v/@ryfylke-react/rtk-query-loader?color=gray&style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/@ryfylke-react/rtk-query-loader?color=gray&label=%20&logoColor=gray)
![npm bundle size](https://img.shields.io/bundlephobia/min/@ryfylke-react/rtk-query-loader@latest?style=flat-square)

**RTK Query Loader lets you create query loaders for your React components.** 

> Made for use with RTK Query, but is also [query-agnostic](#features).

- [Live demo / Playground](https://codesandbox.io/s/rtk-query-loader-demo-42tubp)
- [NPM](https://www.npmjs.com/package/@ryfylke-react/rtk-query-loader)
- [Documentation](https://rtk-query-loader.ryfylke.dev/)
- [Quick Start](https://rtk-query-loader.ryfylke.dev/Quick%20Guide/)

## Install

```bash
yarn add @ryfylke-react/rtk-query-loader
# or
npm i @ryfylke-react/rtk-query-loader
```

## Features

- [x] **Flexible**: You can extend and inherit existing loaders to create new ones.
- [x] **Transformable**: Combine and transform the data from your loaders to your desired format.
- [x] **Query Agnostic**: Can be used with RTK Query, Tanstack Query, JS promises, [and more...](https://rtk-query-loader.ryfylke.dev/Features/other-libs)
- [x] **Configurable**: Exposes important configuration options, all of which are inheritable.

You can read more about the features @ [the docs](https://rtk-query-loader.ryfylke.dev/Features/).



<details>
    <summary> 🔬 We're also properly tested! (✓ 30/30)</summary>

---

  * **aggregateToQuery**  
     * ✓ It aggregates query status (167 ms)
  * **useCreateQuery**  
     * ✓ It creates a query (107 ms)
     * ✓ The query can throw error (108 ms)
     * ✓ You can refetch the query (645 ms)
  * **<AwaitLoader />**  
     * ✓ Renders loading state until data is available (130 ms)
     * ✓ Will pass arguments properly (129 ms)
  * **withLoader**  
     * ✓ Renders loading state until data is available (132 ms)
     * ✓ onError renders when applicable (130 ms)
     * ✓ onFetching renders when applicable (319 ms)
     * ✓ Internal state won't reset when using whileFetching (272 ms)
     * ✓ Internal state will reset when using onFetching (271 ms)
     * ✓ Can use custom loader component (129 ms)
     * ✓ loaderComponent is backwards compatible (121 ms)
     * ✓ Can defer some queries (231 ms)
     * ✓ Can defer all queries (130 ms)
     * ✓ Loaders with no queries render immediately (4 ms)
     * ✓ Can remount a component that has a failed query (161 ms)
  * **createLoader**  
     * ✓ Normally, deferred queries do not throw (205 ms)
     * ✓ Deferred queries throw error when configured to (209 ms)
     * ✓ Can send static payload to loader (7 ms)
     * ✓ Loader passes props through queriesArg to queries (128 ms)
     * **.extend()**  
        * ✓ Can extend onLoading (5 ms)
        * ✓ Can extend onError (128 ms)
        * ✓ Can extend onFetching (156 ms)
        * ✓ Can extend whileFetching (133 ms)
        * ✓ Can extend queries (122 ms)
        * ✓ Can extend deferred queries (230 ms)
        * ✓ Can extend many times (282 ms)
        * ✓ Can extend with only transform (133 ms)
        * ✓ Can partially extend config (138 ms)
      
  ---
</details>

## Example 
A simple example of a component using rtk-query-loader:

```tsx
import {
  createLoader,
  withLoader,
} from "@ryfylke-react/rtk-query-loader";

const loader = createLoader({
  useQueries: () => {
    const pokemon = useGetPokemon();
    const currentUser = useGetCurrentUser();

    return {
      queries: {
        pokemon,
        currentUser,
      },
    };
  },
  onLoading: () => <div>Loading pokemon...</div>,
});

const Pokemon = withLoader((props, loader) => {
  const pokemon = loader.queries.pokemon.data;
  const currentUser = loader.queries.currentUser.data;

  return (
    <div>
      <h2>{pokemon.name}</h2>
      <img src={pokemon.image} />
      <a href={`/users/${currentUser.id}/pokemon`}>
        Your pokemon
      </a>
    </div>
  );
}, loader);
```

## What problem does this solve?

Let's say you have a component that depends on data from more than one query.

```tsx
function Component(props){
  const userQuery = useGetUser(props.id);
  const postsQuery = userGetPostsByUser(userQuery.data?.id, {
    skip: user?.data?.id === undefined,
  });

  if (userQuery.isError || postsQuery.isError){
    // handle error
  }

  /* possible something like */
  // if (userQuery.isLoading){ return (...) }

  return (
    <div>
      {/* or checking if the type is undefined in the jsx */}
      {(userQuery.isLoading || postsQuery.isLoading) && (...)}
      {userQuery.data && postsQuery.data && (...)}
    </div>
  )
}
```

The end result is possibly lots of bloated code that has to take into consideration that the values could be undefined, optional chaining, etc...

What if we could instead "join" these queries into one, and then just return early if we are in the initial loading stage. That's basically the approach that rtk-query-loader takes. Some pros include:

- [x] Way less optional chaining in your components
- [x] Better type certainty
- [x] Easy to write re-usable loaders that can be abstracted away from the components

## [Documentation](https://rtk-query-loader.ryfylke.dev)

## [Quick Guide](https://rtk-query-loader.ryfylke.dev/Quick%20Guide/)
