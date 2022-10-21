import React from "react";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export const withLoader = <
  P extends Record<string, unknown>,
  R extends unknown,
  A = never
>(
  Component: Types.ComponentWithLoaderData<P, R>,
  args: Types.WithLoaderArgs<P, R, A>
): Types.Component<P> => {
  return (props: P) => {
    const useLoaderArgs = [];
    if (args.useLoaderArg) {
      useLoaderArgs.push(args.useLoaderArg(props));
    }
    const query = args.useLoader(
      ...(useLoaderArgs as Types.OptionalGenericArg<A>)
    );
    return (
      <RTKLoader
        query={query}
        loader={args.onLoading?.(props)}
        onError={
          args.onError
            ? (error) =>
                args.onError?.(props, error) ?? (
                  <React.Fragment />
                )
            : undefined
        }
        onSuccess={(data) => Component(props, data)}
        onFetching={args?.onFetching?.(props)}
      />
    );
  };
};
