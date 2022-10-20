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
  loader?: React.ReactElement;
};

export function RTKLoader<T>(
  props: Props<T>
): React.ReactElement {
  if (props.query.isLoading || props.query.isUninitialized) {
    return props.loader ?? <React.Fragment />;
  }
  if (props.query.isError && props.query.error) {
    console.warn(
      `RTKLoader error: ${props.query.requestId}`,
      props.query.error
    );
    return (
      props.onError?.(props.query.error) ?? <React.Fragment />
    );
  }
  if (props.query.isFetching && props.onFetching) {
    return props.onFetching;
  }
  if (props.query.data !== undefined) {
    console.log("Got data", props.query.data);
    return props.onSuccess(props.query.data);
  }
  return <React.Fragment />;
}
