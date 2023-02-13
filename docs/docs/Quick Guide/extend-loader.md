---
sidebar_position: 2
---

# Extend the base loader

Extend from the base loader so that you inherit the sensible defaults. You can overwrite these at any point.

```tsx title="/src/loaders/userRouteLoader.tsx" {3-11}
import { baseLoader } from "./baseLoader";

export const userRouteLoader = baseLoader.extend({});
```

You can pass any argument from [`createLoader`](/Exports/create-loader) into `Loader.extend`.

Its up to you how much you want to separate logic here. Some examples would be...

- Co-locating loaders in a shared folder
- Co-locating loaders in same file as component
- Co-locating loaders in same directory but in a separate file from the component

I personally prefer to keep the loaders close to the component, either in a file besides it or directly in the file itself, and then keep a base loader somewhere else to extend from.
