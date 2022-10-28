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
  return (props: P) => {
    const useLoaderArgs = [];
    if (args.queriesArg) {
      useLoaderArgs.push(args.queriesArg(props));
    }
    const query = args.useLoader(
      ...(useLoaderArgs as Types.OptionalGenericArg<A>)
    );

    const ForwardedComponent = React.useCallback(
      React.forwardRef(
        Component as React.ForwardRefRenderFunction<R, P>
      ) as unknown as Types.ComponentWithLoaderData<P, R>,
      []
    );

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
          <ForwardedComponent {...props} ref={data} />
        )}
        onFetching={args?.onFetching?.(
          props,
          query.data
            ? () => (
                <ForwardedComponent
                  {...props}
                  ref={query.data as R}
                />
              )
            : () => <React.Fragment />
        )}
      />
    );
  };
};
