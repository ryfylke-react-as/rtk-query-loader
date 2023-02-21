---
sidebar_position: 3
---

# Simple example

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
