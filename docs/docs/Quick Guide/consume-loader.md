---
sidebar_position: 4
---

# Consume the loader

## Using `withLoader`

A convenient wrapper that ensures that the component is only rendered when it has data. This is definitely the preferred and optimal way to consume the loaders.

```tsx title="/src/routes/UserRoute.tsx" {8-22}
import { withLoader } from "@ryfylke-react/rtk-query-loader";
import { userRouteLoader } from "../loaders/baseLoader";

type Props = {
  /* ... */
};

export const UserRoute = withLoader((props: Props, queries) => {
  // `queries` is typed correctly, and ensured to have loaded.
  const user = queries[0].data;
  const posts = queries[1].data;
  return (
    <article>
      <header>
        <h2>{user.name}</h2>
      </header>
      <main>
        {posts.map((post) => (...))}
      </main>
    </article>
  );
}, userRouteLoader);
```

## Using `useLoader`

Every `Loader` contains an actual hook that you can call to run all the queries and aggregate their statuses as if they were just one joined query.

```tsx {3,9}
import { userRouteLoader } from "./baseLoader";

const useLoaderData = userRouteLoader.useLoader;

type Props = {
  /* ... */
};
const UserRoute = (props: Props) => {
  const loaderQuery = useLoaderData();

  if (loaderQuery.isLoading) {
    // ...
  }

  if (loaderQuery.isError) {
    // ...
  }
  // ...
};
```
