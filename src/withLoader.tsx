import React, { ReactElement } from "react";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export type WithLoaderArgs<
  P extends unknown,
  R extends unknown,
  A = never
> = {
  useLoader: Types.UseLoader<A, R>;
  useLoaderArg?: (props: P) => A;
  onLoading?: (props: P) => ReactElement;
};

export type Component<P extends Record<string, unknown>> = (
  props: P
) => ReactElement;

export const withLoader = <
  P extends Record<string, unknown>,
  R extends unknown,
  A = never
>(
  Component: Types.ComponentWithLoaderData<P, R>,
  args: WithLoaderArgs<P, R, A>
): Component<P> => {
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
        onSuccess={(data) => Component(props, data)}
      />
    );
  };
};
