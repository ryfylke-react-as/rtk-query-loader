# @ryfylke-react/rtk-query-loader

![ryfrea-rtk-query-loader](https://user-images.githubusercontent.com/1190770/233955284-a7da801e-ff3f-4fdc-9808-8f1e5a829012.png)

![npm](https://img.shields.io/npm/v/@ryfylke-react/rtk-query-loader?color=gray&style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/@ryfylke-react/rtk-query-loader?color=gray&label=%20&logoColor=gray)
![npm bundle size](https://img.shields.io/bundlephobia/min/@ryfylke-react/rtk-query-loader@latest?style=flat-square)

Lets you create loaders that contain multiple RTK queries.

- [Live demo / Playground](https://codesandbox.io/s/rtk-query-loader-demo-42tubp)
- [NPM](https://www.npmjs.com/package/@ryfylke-react/rtk-query-loader)
- [Documentation](https://rtk-query-loader.ryfylke.dev/)
- [Quick Start](https://rtk-query-loader.ryfylke.dev/Quick%20Guide/)

## **Usage**

```bash
yarn add @ryfylke-react/rtk-query-loader
# or
npm i @ryfylke-react/rtk-query-loader
```

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
