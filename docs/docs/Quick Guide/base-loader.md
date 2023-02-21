---
sidebar_position: 1
---

# Create a base loader

A `Loader` can control the loading, fetch and error state views for consumer components.

:::tip
Use a base loader to create sensible "fallback"/"default"-states for consumer components.
:::

```tsx title="/src/loaders/baseLoader.tsx" {7-20}
import {
  createLoader,
  withLoader,
} from "@ryfylke-react/rtk-query-loader";
import { Loading, GenericErrorView } from "../components/common";

export const baseLoader = createLoader({
  onLoading: () => <Loading />,
  onError: (props, error) => <GenericErrorView error={error} />,
});
```
