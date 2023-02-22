---
sidebar_position: 3
---

# Simple example

```tsx {10-23,26-35}
import {
  withLoader,
  createLoader,
} from "@ryfylke-react/rtk-query-loader";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../api/user";
import { ErrorView } from "../components/ErrorView";

// Create a loader
const userRouteLoader = createLoader({
  useQueries: () => {
    const { userId } = useParams();
    const userQuery = useGetUserQuery(userId);

    return {
      queries: {
        userQuery,
      },
    };
  },
  onLoading: (props) => <div>Loading...</div>,
  onError: (props, error) => <ErrorView error={error} />,
});

// Consume the loader
const UserRoute = withLoader((props, loader) => {
  // Queries have successfully loaded
  const user = loader.queries.userQuery.data;

  return (
    <div>
      <h2>{user.name}</h2>
    </div>
  );
}, userRouteLoader);
```
