# @ryfylke-react/rtk-query-loader

Lets you create loaders that contain multiple RTK queries.

[Live demo / Playground](https://stackblitz.com/edit/react-ts-bwcrzm)

## **Usage**

```bash
yarn add @ryfylke-react/rtk-query-loader
# or
npm i @ryfylke-react/rtk-query-loader
```

Here's a simple example of a component using rtk-query-loader:

```tsx
import {
  createUseLoader,
  RTKLoader,
} from "@ryfylke-react/rtk-query-loader";

const loader = createLoader({
  queries: () => {
    const pokemon = useGetPokemon();
    const currentUser = useGetCurrentUser();
    return [pokemon, currentUser] as const;
  },
  onLoading: () => <div>Loading pokemon...</div>,
});

const Pokemon = withLoader((props, [pokemonQ, currentUserQ]) => {
  const pokemon = pokemonQ.data;
  const currentUser = pokemonQ.data;

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

## withLoader

`withLoader` cuts away some copy-paste code, and makes the component file even cleaner:

```tsx
const useLoader = createLoader(...);

const Component = withLoader(
  (props: Props, loaderData) => {
    // Can safely assume that loaderData and props are populated.
     const posts = loaderData.posts;

     return posts.map(,,,);
  },
  {
    useLoader,
    useLoaderArg: (props) => undefined, // Could fetch arg from props here
    onLoading: (props) => <>Loading...</>,
  }
)

```

### InferLoaderData

Infers the type of the data the loader returns. Use:

```typescript
const useLoader = createLoader(...);
type LoaderData = InferLoaderData<typeof useLoader>;
```

Typescript should infer the loader data type automatically inside `withLoader`, but if you need the type elsewhere then this could be useful.

## Future features & wants

- `extendLoader` - Creates a new loader that extends an existing loader
- Better type resolving:

```typescript
createLoader({
  queries: () => {
    return [useGetUser(), useGetPosts()] as const;
  },
  transform: function (queries) {
    // queries here are guaranteed to have .data, but currently the type resolves data as optional.
    return {
      name: queries[0].data.name, // is technically safe, but typescript might complain
    };
  },
});
```
