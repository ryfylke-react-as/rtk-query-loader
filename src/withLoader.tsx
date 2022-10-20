import React, { ReactElement } from "react";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export type WithLoaderArgs<
  P extends unknown,
  R extends unknown,
  A = never
> = {
  useLoader: Types.UseLoader<A, R>;
  arg?: (props: P) => A;
  onLoading?: ReactElement;
};

export type Component<P extends Record<string, unknown>> = (
  props: P
) => ReactElement;

export const withLoader = <
  P extends Record<string, unknown>,
  R extends unknown,
  A = never
>(
  args: WithLoaderArgs<P, R, A>,
  Component: Component<P & { loaderData: R }>
): Component<P> => {
  return (props: P) => {
    const useLoaderArgs = [];
    if (args.arg) {
      useLoaderArgs.push(args.arg(props));
    }
    const query = args.useLoader(
      ...(useLoaderArgs as Types.OptionalGenericArg<A>)
    );
    return (
      <RTKLoader
        query={query}
        loader={args.onLoading}
        onSuccess={(data) => (
          <Component {...props} loaderData={data} />
        )}
      />
    );
  };
};
