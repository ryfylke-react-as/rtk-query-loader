---
sidebar_position: 4
---

# useCreateQuery

#### **Warning**: This API is experimental and might change.

Lets you use any function that returns a promise in your loader as if it was an RTK useQuery.

```typescript
import {
  createLoader,
  useCreateQuery,
} from "@ryfylke-react/rtk-query-loader";

const loader = createLoader({
  queries: (userId: string) => {
    const query = useCreateQuery(async () => {
      const res = await fetch(`users/${userId}`);
      const json = await res.json();
      return json as SomeDataType;
      // dependency array
    }, [userId]);
    return [query] as const;
  },
});
```
