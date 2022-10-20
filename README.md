# @ryfylke-react/rtk-query-loader

Lets you create loaders that contain multiple RTK queries.

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
