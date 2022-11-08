import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import React from "react";
import * as Types from "./types";

export const withLoader = <
  P extends Record<string, any>,
  R extends unknown,
  A = never
>(
  Component: Types.ComponentWithLoaderData<P, R>,
  loader: Types.Loader<P, R, A>
): Types.Component<P> => {
  let CachedComponent: Types.ComponentWithLoaderData<P, R>;
  const LoadedComponent = (props: P) => {
    const useLoaderArgs = [];
    if (loader.queriesArg) {
      useLoaderArgs.push(loader.queriesArg(props));
    }
    const query = loader.useLoader(
      ...(useLoaderArgs as Types.OptionalGenericArg<A>)
    );
    if (!CachedComponent) {
      CachedComponent = React.forwardRef(
        Component as React.ForwardRefRenderFunction<R, P>
      ) as unknown as Types.ComponentWithLoaderData<P, R>;
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

    const onSuccess = (data: R) => (
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
        ? () => onSuccess(query.data as R)
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
