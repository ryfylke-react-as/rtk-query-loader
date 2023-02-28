import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import React from "react";
import * as Types from "./types";

export const withLoader = <
  TProps extends Record<string, any>,
  TReturn extends unknown,
  TQueries extends Types._TQueries,
  TDeferred extends Types._TDeferred,
  TPayload extends Types._TPayload,
  TArg = never
>(
  Component: Types.ComponentWithLoaderData<TProps, TReturn>,
  loader: Types.Loader<
    TProps,
    TReturn,
    TQueries,
    TDeferred,
    TPayload,
    TArg
  >
): Types.Component<TProps> => {
  let CachedComponent: Types.ComponentWithLoaderData<
    TProps,
    TReturn
  >;
  const LoadedComponent = (props: TProps) => {
    const useLoaderArgs = [];
    if (loader.queriesArg) {
      useLoaderArgs.push(loader.queriesArg(props));
    }
    const query = loader.useLoader(
      ...(useLoaderArgs as Types.OptionalGenericArg<TArg>)
    );
    if (!CachedComponent) {
      CachedComponent = React.forwardRef(
        Component as React.ForwardRefRenderFunction<
          TReturn,
          TProps
        >
      ) as unknown as Types.ComponentWithLoaderData<
        TProps,
        TReturn
      >;
    }

    const onLoading = loader.onLoading?.(props);

    const onError = loader.onError
      ? (error: SerializedError | FetchBaseQueryError) => {
          if (!loader.onError) return <React.Fragment />;
          return loader.onError(
            props,
            error,
            query as Types.UseQueryResult<undefined>
          );
        }
      : undefined;

    const onSuccess = (data: TReturn) => (
      <CachedComponent {...props} ref={data} />
    );

    const whileFetching = loader.whileFetching
      ? {
          prepend: loader.whileFetching.prepend?.(
            props,
            query?.data
          ),
          append: loader.whileFetching.append?.(
            props,
            query?.data
          ),
        }
      : undefined;

    const onFetching = loader?.onFetching?.(
      props,
      query.data
        ? () => onSuccess(query.data as TReturn)
        : () => <React.Fragment />
    );

    const { LoaderComponent } = loader;

    return (
      <LoaderComponent
        onFetching={onFetching}
        whileFetching={whileFetching}
        onSuccess={
          onSuccess as (data: unknown) => React.ReactElement
        }
        onError={onError}
        onLoading={onLoading}
        query={query}
      />
    );
  };
  return LoadedComponent;
};
