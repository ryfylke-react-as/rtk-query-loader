import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import * as React from "react";
import * as Types from "./types";

/**
 * A higher order component that wraps a component and provides it with a loader.
 * @param Component The component to wrap with a loader. Second argument is the resolved loader data.
 * @param loader The loader to use.
 * @returns A component that will load the data and pass it to the wrapped component.
 * @example
 * const Component = withLoader((props, loaderData) => {
 *  return <div>{loaderData.queries.user.name}</div>;
 * }, loader);
 */
export const withLoader = <
  TProps extends Record<string, any>,
  TReturn extends unknown,
  TQueries extends Types._TQueries,
  TDeferred extends Types._TDeferred,
  TPayload extends Types._TPayload,
  TArg = never
>(
  Component: Types.ComponentWithLoaderData<
    TProps,
    Types.Unwrap<TReturn>
  >,
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
        Component as unknown as React.ForwardRefRenderFunction<
          TReturn,
          TProps
        >
      ) as unknown as Types.ComponentWithLoaderData<
        TProps,
        TReturn
      >;
    }

    const onLoading = loader.onLoading?.(props, query);

    const onError = loader.onError
      ? (error: SerializedError | FetchBaseQueryError) => {
          if (!loader.onError) return <React.Fragment />;
          return loader.onError(props, error, query);
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
