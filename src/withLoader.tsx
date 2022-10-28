import React from "react";
import { useDebounce } from "./hooks/useDebounce";
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
    const debouncedQueryArgs = useDebounce(
      useLoaderArgs as Types.OptionalGenericArg<A>,
      args.debounce ?? 0
    );
    const query = args.useLoader(
      ...(args.debounce
        ? debouncedQueryArgs
        : (useLoaderArgs as Types.OptionalGenericArg<A>))
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
        onSuccess={(data) =>
          React.createElement(
            Component,
            { ...props, ref: data },
            (props as any)?.children ?? null
          )
        }
        onFetching={args?.onFetching?.(
          props,
          query.data
            ? () =>
                React.createElement(
                  Component,
                  { ...props, ref: query.data as R },
                  (props as any)?.children
                )
            : () => <React.Fragment />
        )}
      />
    );
  };
};
