---
sidebar_position: 2
---

# What problem does this solve?

Handling the loading and error state of components that depend on external data can be tedious,
especially when there are multiple queries. It is also usually solved inconsistently throughout the project. Your options are essentially

1. Return early (and show loading state)
2. Deal with it in the JSX using conditional rendering, optional chaining, etc...

If you are going for `2`, then you will also have to deal with the type being `T | undefined` in your component methods, which is a bummer.

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

What if we could instead "join" these queries into one, and then just return early if we are in the initial loading stage. That's basically the approach that rtk-query-loader takes. Some pros include:

- [x] You get to isolate the data-loading code away from the presentational components
- [x] Better type certainty
- [x] Way less optional chaining in your components
- [x] Reusability across multiple components
- [x] Extendability
- [x] Transform the output to any format you'd like.

## What does it look like?

```tsx {10-19,22-31}
import {
  withLoader,
  createLoader,
} from "@ryfylke-react/rtk-query-loader";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../api/user";
import { ErrorView } from "../components/ErrorView";

// Create a loader
const userRouteLoader = createLoader({
  queries: () => {
    const { userId } = useParams();
    const userQuery = useGetUserQuery(userId);

    return [userQuery] as const; // important
  },
  onLoading: (props) => <div>Loading...</div>,
  onError: (props, error) => <ErrorView error={error} />,
});

// Consume the loader
const UserRoute = withLoader((props: {}, queries) => {
  // Queries have successfully loaded
  const user = queries[0].data;

  return (
    <div>
      <h2>{user.name}</h2>
    </div>
  );
}, userRouteLoader);
```

> Get started with our recommended best practises by following the [**Quick guide**](/Quick%20guide) on the next page.
