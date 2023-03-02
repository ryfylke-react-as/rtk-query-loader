---
sidebar_position: 5
---

# Custom `loaderComponent`

A `loaderComponent` is the component that determines what to render given the aggregated query status, when using `withLoader`.

```typescript title="loaderComponent Props"
export type CustomLoaderProps<T = unknown> = {
  /** The joined query for the loader */
  query: UseQueryResult<T>;
  /** What the loader requests be rendered when data is available */
  onSuccess: (data: T) => React.ReactElement;
  /** What the loader requests be rendered when the query fails */
  onError?: (
    error: SerializedError | FetchBaseQueryError
  ) => JSX.Element;
  /** What the loader requests be rendered while loading data */
  onLoading?: React.ReactElement;
  /** What the loader requests be rendered while fetching data */
  onFetching?: React.ReactElement;
  /** What the loader requests be rendered while fetching data */
  whileFetching?: {
    /** Should be appended to the success result while fetching */
    append?: React.ReactElement;
    /** Should be prepended to the success result while fetching */
    prepend?: React.ReactElement;
  };
};
```

This is what the default `loaderComponent` looks like:

```typescript title=RTKLoader.tsx
import { SerializedError } from "@reduxjs/toolkit";
import * as React from "react";
import { CustomLoaderProps } from "./types";

export function RTKLoader<T>(
  props: CustomLoaderProps<T>
): React.ReactElement {
  const shouldLoad =
    props.query.isLoading || props.query.isUninitialized;
  const hasError = props.query.isError && props.query.error;
  const isFetching = props.query.isFetching;

  if (shouldLoad) {
    return props.onLoading ?? <React.Fragment />;
  }

  if (hasError) {
    return (
      props.onError?.(props.query.error as SerializedError) ?? (
        <React.Fragment />
      )
    );
  }

  if (isFetching && props.onFetching) {
    return props.onFetching;
  }

  if (props.query.data !== undefined) {
    const prepend = isFetching
      ? props.whileFetching?.prepend ?? null
      : null;
    const append = isFetching
      ? props.whileFetching?.append ?? null
      : null;
    const componentWithData = props.onSuccess(props.query.data);

    return (
      <>
        {prepend}
        {componentWithData}
        {append}
      </>
    );
  }

  return <React.Fragment />;
}
```

You could pass a custom `loaderComponent` to your loaders, if you'd like:

```typescript
const CustomLoader = (props: CustomLoaderProps) => {
  // Handle rendering
};

const loader = createLoader({
  loaderComponent: CustomLoader,
  // ...
});
```

:::tip
This allows you to have really fine control over how the rendering of components using `withLoader` should work.
:::
