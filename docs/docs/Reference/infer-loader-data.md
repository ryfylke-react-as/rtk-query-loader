---
sidebar_position: 5
---

# `InferLoaderData<>`

Returns the return type of a given `Loader`:

```typescript
import {
    createLoader,
    InferLoaderData,
} from "@ryfylke-react/rtk-query-loader";

const loader = createLoader({...});

type LoaderData = InferLoaderData<typeof loader>;
```
