---
sidebar_position: 3
---

# Adding queries

You can now start to add queries to your extended loaders.

The `queries` argument of [createLoader](/Exports/create-loader) is a _hook_, which means that [the rules of hooks](https://reactjs.org/docs/hooks-rules.html) apply. This gives you the super-power of utilizing other hooks inside of your loader.

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

The hook should return a `readonly array` of the `useQuery` results. This means that in typescript, you need to specify `as const` after the array.

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

:::caution Beware
If you want to consume this loader through `withLoader`, you need to add the `queriesArg` argument. This supplies the loader with an argument piped from `props`.
:::

### `queriesArg`

This argument transforms the consumer's props to the queries argument.

```tsx {1-5,8-10}
// This means that any component that has props that extend this
// type can consume the loader using `withLoader`
type UserRouteLoaderProps = Record<string, any> & {
  userId: string;
};

export const userRouteLoader = baseLoader.extend({
  queriesArg: (props: UserRouteLoaderProps) => props.userId,
  // type is now inferred from queriesArg return
  queries: (userId) => {
    const user = useGetUserQuery(userId);
    const posts = useGetPostsByUser(userId);

    return [user, posts] as const;
  },
});
```

A component consuming this loader would pass the argument automatically through this pipeline:

```typescript
// props → queriesArg → queries
loaderArgs.queries(queriesArg(consumerProps));
```

```typescript
<UserRoute userId="1234" />
// → queriesArg({ userId: "1234" })
// → "1234"
// → loader.queries("1234")
```
