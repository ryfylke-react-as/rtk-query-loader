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
  createLoader,
  RTKLoader,
} from "@ryfylke-react/rtk-query-loader";

const useLoader = createLoader({
  queries: () => {
    const user = useQueryA();
    const posts = useQueryB();
    return [user, posts];
  },
});

const Component = () => {
  const query = useLoader();

  return (
    <RTKLoader
      query={query}
      onSuccess={([user, posts]) => (
        <ComponentWithData user={user.data} posts={posts.data} />
      )}
    />
  );
};

const ComponentWithData = (props) => {
  // Can safely assume that loader data exists.
  return (
    <div>
      {props.user.firstName} {props.user.lastName}
    </div>
  );
};
```

## Passing arguments

If you want to pass arguments to the queries, you can do so by using the first argument of `queries` (typescript will pick this up automatically):

```typescript
type LoaderArgs = {
  userArgs: UserArgs;
  postArgs: PostArgs;
}

const useLoader = createLoader({
  queries: (args: LoaderArgs) => {
    const user = useQueryA(args.userArgs);
    const posts = useQueryB(args.postArgs);
    return [user, posts];
  }
})
//...
const query = useLoader({ // Expects one required argument of type LoaderArgs
  userArgs: {...},
  postArgs: {...}
});
```

## Loading state

Althrough you could definitely use your own `RTKLoader`-like component to handle the loading state, we have exposed a simple function that does the switching for you.

```tsx
<RTKLoader
  query={query}
  loader={<div>isLoading...</div>}
  onFetching={<div>isFetching (reloading)...</div>}
  onError={(error) => <div>Something bad happened...</div>}
  onSuccess={(data) => <div>Finished loading</div>}
/>
```

You could also implement the loading state manually, of course.

```tsx
function Component() {
  const query = useLoader();

  if (query.isLoading) {
    return "Loading...";
  }
  if (!query.isSuccess) {
    return "Something happened...";
  }
  //...
}
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

## Future features & wants

- `withLoader`: I imagine something like this:

```tsx
import { withLoader } from "@ryfylke-react/rtk-query-loader";
import { Loading } from "components/common";
import { useLoader } from "./Username.loader";

export const Username = withLoader(
  {
    useLoader,
    arg: (props) => props.userId,
    onLoading: <Loading />,
  },
  (props) => {
    const { currentUser } = props.loaderData;

    return <div>{currentUser.name}</div>;
  }
);
```

Which would be equivalent to:

```tsx
import { RTKLoader } from "@ryfylke-react/rtk-query-loader";
import { Loading } from "components/common";
import { useLoader } from "./Username.loader";

const Username = (props) => {
  const query = useLoader(prps.userId);
  return (
    <RTKLoader
      query={query}
      loader={<Loading />}
      onSuccess={(data) => (
        <UsernameWithData loaderData={data} />
      )}
    />
  );
};

const UsernameWithData = (props) => {
  const { currentUser } = props.loaderData;

  return <div>{currentUser.name}</div>;
};
```

- `extendLoader` - Creates a new loader that extends an existing loader
