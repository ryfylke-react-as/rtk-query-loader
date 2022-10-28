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
  if (props.query.isLoading || props.query.isUninitialized) {
    return props.loader ?? <React.Fragment />;
  }
  if (props.query.isError && props.query.error) {
    return (
      props.onError?.(props.query.error as SerializedError) ?? (
        <React.Fragment />
      )
    );
  }
  if (props.query.isFetching && props.onFetching) {
    return props.onFetching;
  }
  if (props.query.data !== undefined) {
    return (
      <>
        {props.query.isFetching
          ? props.whileFetching?.prepend ?? null
          : null}
        {props.onSuccess(props.query.data)}
        {props.query.isFetching
          ? props.whileFetching?.append ?? null
          : null}
      </>
    );
  }
  return <React.Fragment />;
}
