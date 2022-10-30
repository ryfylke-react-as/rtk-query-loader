import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import * as React from "react";
import { UseQueryResult } from "./types";

type Props<T> = {
  query: UseQueryResult<T>;
  onSuccess: (data: T) => React.ReactElement;
  onError?: (
    error: FetchBaseQueryError | SerializedError
  ) => React.ReactElement;
  onFetching?: React.ReactElement;
  whileFetching?: {
    append?: React.ReactElement;
    prepend?: React.ReactElement;
  };
  loader?: React.ReactElement;
};

export function RTKLoader<T>(
  props: Props<T>
): React.ReactElement {
  const shouldLoad =
    props.query.isLoading || props.query.isUninitialized;
  const hasError = props.query.isError && props.query.error;
  const isFetching = props.query.isFetching;

  if (shouldLoad) {
    return props.loader ?? <React.Fragment />;
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
