import * as React from "react";
import * as Types from "./types";
import { withLoader } from "./withLoader";
type ReactType = typeof React;
let R = React;

type AwaitLoaderProps<
  TProps extends Record<string, any>,
  TReturn,
  TArg = never
> = [TArg] extends [never]
  ? {
      loader: Types.Loader<TProps, TReturn, any, any, any, TArg>;
      render: (data: TReturn) => React.ReactElement;
    }
  : {
      loader: Types.Loader<TProps, TReturn, any, any, any, TArg>;
      render: (data: TReturn) => React.ReactElement;
      args: TProps;
    };

/**
 * @typedef AwaitLoaderProps
 * @type {Object}
 * @property {Types.Loader<TProps, TReturn, any, any, any, TArg>} loader The loader to use.
 * @property {(data: TReturn) => React.ReactElement} render The render function to use.
 * @property {TProps} args The arguments to pass to the loader.
 */

/**
 * A component that awaits a loader and renders the data.
 * @param {AwaitLoaderProps} args The arguments to pass to the loader. 
 */
export const AwaitLoader = <
  TProps extends Record<string, any>,
  TReturn extends unknown,
  TArg = never
>(
  args: AwaitLoaderProps<TProps, TReturn, TArg>
) => {
  const Component = R.useCallback(
    withLoader(
      (_, loaderData) => args.render(loaderData),
      args.loader
    ),
    []
  );
  return R.createElement(
    Component,
    "args" in args ? args.args : ({} as TProps),
    null
  );
};

export const _testLoad = (react: any) => {
  R = react as ReactType;
  return AwaitLoader;
};
