import { SerializedError } from "@reduxjs/toolkit";
import * as React from "react";
import { CustomLoaderProps } from "./types";

/**
 * The default loader component for use with RTK Query Loader.
 */
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
