---
sidebar_position: 3
---

# 3. Add queries

You can now start to add queries to your extended loaders.

The `useQueries` argument of [createLoader](/Reference/create-loader) is a _hook_, which means that [the rules of hooks](https://reactjs.org/docs/hooks-rules.html) apply. This gives you the super-power of utilizing other hooks inside of your loader.

```tsx title="/src/loaders/userRouteLoader.tsx" {6-15}
import { baseLoader } from "./baseLoader";
// ...

export const userRouteLoader = baseLoader.extend({
  useQueries: () => {
    const { userId } = useParams();
    const user = useGetUserQuery(userId);
    const posts = useGetPostsByUser(userId);

    return {
      queries: {
        user,
        posts,
      },
    };
  },
});
```

You can add as many queries as you'd like to `Response.queries`, and they will all aggregate to a common loading state.
