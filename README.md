# @ryfylke-react/rtk-query-loader

![npm](https://img.shields.io/npm/v/@ryfylke-react/rtk-query-loader?color=gray&style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/@ryfylke-react/rtk-query-loader?color=gray&label=%20&logoColor=gray)
![npm bundle size](https://img.shields.io/bundlephobia/min/@ryfylke-react/rtk-query-loader@latest?style=flat-square)

Lets you create loaders that contain multiple RTK queries.

- [Live demo / Playground](https://codesandbox.io/s/rtk-query-loader-demo-42tubp)
- [NPM](https://www.npmjs.com/package/@ryfylke-react/rtk-query-loader)

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
  queries: () => {
    const pokemon = useGetPokemon();
    const currentUser = useGetCurrentUser();
    return [pokemon, currentUser] as const;
  },
  onLoading: () => <div>Loading pokemon...</div>,
});

const Pokemon = withLoader((props, queries) => {
  const pokemon = queries[0].data;
  const currentUser = queries[1].data;

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

# Exports

## createLoader

Creates a `Loader`.

```typescript
const loader = createLoader({
  queries: () => [useGetUsers()] as const,
});
```

### Argument object:

**queries**?: `(arg?: T) => readonly UseQueryResults<unknown>[]`

Returns a `readonly` array of useQuery results.

**transform**?: `(queries: readonly UseQueryResult[]) => T`

Transforms the list of queries to the desired loader output format.

**queriesArg**?: `(props: T) => A`

Creates an argument for the queries function based on expected props. Useful when you have queries in your loader that need arguments from the props of the component.

**onLoading**?: `(props: T) => ReactElement`

**onError**?: `(props: T, error: RTKError) => ReactElement`

**onFetching**?: `(props: T, Component: (() => ReactElement)) => ReactElement`

Make sure you call the second argument as a component, not a function:

```tsx
{
  onFetching: (props, Component) => (
    <div className="relative-wrapper">
      <Component />
      <LoadingOverlay />
    </div>
  );
}
```

**whileFetching**?:

```typescript
{
  append?: (props: P, data?: R) => ReactElement;
  prepend?: (props: P, data?: R) => ReactElement;
}
```

By using this instead of `onFetching`, you ensure that you don't reset the internal state of the component while fetching.

## withLoader

Wraps a component to provide it with loader data.

```tsx
const postsLoader = createLoader(...);

const Component = withLoader(
  (props: Props, loaderData) => {
    // Can safely assume that loaderData and props are populated.
     const posts = loaderData.posts;

     return posts.map(,,,);
  },
  postsLoader
)

```

### Arguments

1. `(props: P, loaderData: R) => ReactElement`  
   Component with loader-data
2. `Loader`  
   Return value of `createLoader`.

### Extending/customizing the loader

To use an existing loader but with maybe a different loading state, for example:

```tsx

const Component = withLoader(
  (props: Props, loaderData) => {
    // Can safely assume that loaderData and props are populated.
     const posts = loaderData.posts;

     return posts.map(,,,);
  },
  postsLoader.extend({
    onLoading: (props) => <props.loader />,
    onFetching: (props) => <props.loader />,
  }),
)

```

## createUseLoader

Creates only the hook for the loader, without the extra metadata like loading state.

Basically just joins multiple queries into one, and optionally transforms the output. Returns a standard RTK useQuery hook.

A good solution for when you want more control over what happens during the lifecycle of the query.

```tsx
const useLoader = createUseLoader({
  queries: (arg: string) =>
    [
      useQuery(arg.query),
      useOtherQuery(arg.otherQuery),
    ] as const,
  transform: (queries) => ({
    query: queries[0].data,
    otherQuery: queries[1].data,
  }),
});

const Component = () => {
  const query = useLoader();

  if (query.isLoading) {
    return <div>loading...</div>;
  }
  //...
};
```

## InferLoaderData

Infers the type of the data the loader returns. Use:

```typescript
const loader = createLoader(...);
type LoaderData = InferLoaderData<typeof loader>;
```

Typescript should infer the loader data type automatically inside `withLoader`, but if you need the type elsewhere then this could be useful.

# Extending loaders

You can extend a loader like such:

```tsx
const baseLoader = createLoader({
  onLoading: () => <Loading />,
});

const pokemonLoader = baseLoader.extend({
  queries: (name: string) => [useGetPokemon(name)],
  queriesArg: (props: PokemonProps) => props.name.toLowerCase(),
});
```

New properties will overwrite existing.

**NOTE**:

> If the loader that you _extend from_ has a `transform` function, and you are change the `queries` function in the _extended_ loader, you might need to do the following fix to resolve the types correctly:

```typescript
const baseLoader = createLoader({
  queries: () => [...],
  transform: () => {i_want: "this-format"},
})

// This first example is extending a loader that has a transform.
// It does not supply a new transform function
const extendedOne = baseLoader.extend(({
   queries: () => [...],
}))

type TestOne = InferLoaderData<typeof extendedOne>;
// Resolves to: { i_want: string; }
// which is incorrect. In reality it defaults to your list of queries.

// In this example, we supply a transform function as well:
const extendedTwo = baseLoader.extend({
  queries: () => [...],
  transform: (q) => q, // This is essentially the default value
});

type TestTwo = InferLoaderData<typeof extendedTwo>;
// Resolves to: readonly [UseQueryResult<...>]
// which is correct.
```

> This is just a type mistake that will hopefully be fixed in the future. Both `extendedOne` and `extendedTwo` return the same format, but `extendedTwo` has the correct types.

## [**Contributing guidelines**](https://github.com/ryfylke-react-as/rtk-query-loader/blob/main/CONTRIBUTING.md)
