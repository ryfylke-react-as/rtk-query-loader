---
sidebar_position: 3
---

# Add queries

You can now start to add queries to your extended loaders.

```tsx title="/src/loaders/userRouteLoader.tsx" {6-10}
import { baseLoader } from "./baseLoader";
// ...

export const userRouteLoader = baseLoader.extend({
  queries: () => {
    const { userId } = useParams();
    const user = useGetUserQuery(userId);
    const posts = useGetPostsByUser(userId);

    return [user, posts] as const;
  },
});
```

As you can see, the `queries` argument is technically a hook. This means that you can run other hooks inside of it.

## Accepting arguments

If you want the loader to take an argument, you can do that.

```tsx {2}
export const userRouteLoader = baseLoader.extend({
  queries: (userId: string) => {
    const user = useGetUserQuery(userId);
    const posts = useGetPostsByUser(userId);

    return [user, posts] as const;
  },
});
```

**If you want to consume this loader through `withLoader`, you need to add the `queriesArg` argument**.

This argument transforms the consumer's props to the queries argument.

```tsx {7-8}
// Matches any component that accepts a prop `userId` which is a `string`.
type UserRouteLoaderProps = Record<string, any> & {
  userId: string;
};

export const userRouteLoader = baseLoader.extend({
  queriesArg: (props: UserRouteLoaderProps) => props.userId,
  queries: (userId) => {
    const user = useGetUserQuery(userId);
    const posts = useGetPostsByUser(userId);

    return [user, posts] as const;
  },
});
```
