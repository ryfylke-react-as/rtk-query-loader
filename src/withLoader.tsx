import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import React from "react";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export const withLoader = <
  P extends Record<string, any>,
  R extends unknown,
  A = never
>(
  Component: Types.ComponentWithLoaderData<P, R>,
  args: Types.WithLoaderArgs<P, R, A>
): Types.Component<P> => {
  let CachedComponent: Types.ComponentWithLoaderData<P, R>;
  const LoaderComponent = (props: P) => {
    const useLoaderArgs = [];
    if (args.queriesArg) {
      useLoaderArgs.push(args.queriesArg(props));
    }
    const query = args.useLoader(
      ...(useLoaderArgs as Types.OptionalGenericArg<A>)
    );
    if (!CachedComponent) {
      CachedComponent = React.forwardRef(
        Component as React.ForwardRefRenderFunction<R, P>
      ) as unknown as Types.ComponentWithLoaderData<P, R>;
    }

    const onLoading = args.onLoading?.(props);

    const onError = args.onError
      ? (error: SerializedError | FetchBaseQueryError) => {
          if (!args.onError) return <React.Fragment />;
          return args.onError(
            props,
            error,
            query as Types.UseQueryResult<undefined>
          );
        }
      : undefined;

    const onSuccess = (data: R) => (
      <CachedComponent {...props} ref={data} />
    );

    const whileFetching = args.whileFetching
      ? {
          prepend: args.whileFetching.prepend?.(
            props,
            query?.data
          ),
          append: args.whileFetching.append?.(
            props,
            query?.data
          ),
        }
      : undefined;

    const onFetching = args?.onFetching?.(
      props,
      query.data
        ? () => onSuccess(query.data as R)
        : () => <React.Fragment />
    );

    return (
      <RTKLoader
        query={query}
        onSuccess={onSuccess}
        onError={onError}
        loader={onLoading}
        onFetching={onFetching}
        whileFetching={whileFetching}
      />
    );
  };
  return LoaderComponent;
};
