import { SerializedError } from "@reduxjs/toolkit";
import * as React from "react";
import { CustomLoaderProps } from "./types";

const hiddenWrapperStyle = {
  display: "none",
};

const shownWrapperStyle = {
  display: "contents",
};

export function RTKLoader<T>(
  props: CustomLoaderProps<T>
): React.ReactElement {
  const shouldLoad =
    props.query.isLoading || props.query.isUninitialized;
  const hasError = props.query.isError && props.query.error;
  const isFetching = props.query.isFetching;

  const wrapperStyle =
    isFetching && props.onFetching
      ? hiddenWrapperStyle
      : shownWrapperStyle;

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

  if (props.query.data !== undefined) {
    const prepend = isFetching
      ? props.whileFetching?.prepend ?? null
      : null;
    const append = isFetching
      ? props.whileFetching?.append ?? null
      : null;
    const onFetchingComponent =
      isFetching && props.onFetching ? props.onFetching : null;

    const componentWithData = props.onSuccess(props.query.data);

    return (
      <>
        {prepend}
        <div
          style={wrapperStyle}
          aria-hidden={isFetching ? true : false}
        >
          {componentWithData}
        </div>
        {onFetchingComponent}
        {append}
      </>
    );
  }

  return <React.Fragment />;
}
