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

    return (
      <RTKLoader
        query={query}
        loader={args.onLoading?.(props)}
        onError={
          args.onError
            ? (error) =>
                args.onError?.(
                  props,
                  error,
                  query as Types.UseQueryResult<undefined>
                ) ?? <React.Fragment />
            : undefined
        }
        onSuccess={(data) => (
          <CachedComponent {...props} ref={data} />
        )}
        whileFetching={
          args.whileFetching
            ? {
                prepend: args.whileFetching?.prepend?.(
                  props,
                  query?.data
                ),
                append: args.whileFetching?.prepend?.(
                  props,
                  query?.data
                ),
              }
            : undefined
        }
        onFetching={args?.onFetching?.(
          props,
          query.data
            ? () => (
                <CachedComponent
                  {...props}
                  ref={query.data as R}
                />
              )
            : () => <React.Fragment />
        )}
      />
    );
  };
  return LoaderComponent;
};
