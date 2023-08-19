import * as React from "react";
import * as Types from "./types";
import { createLoader } from "./createLoader";

/**
 * Allows you to create a loader inside of a component.
 * This is useful if you want to create a loader for use with `AwaitLoader`, scoped to a component.
 */
export const useCreateLoader = <
  TProps extends unknown,
  TQueries extends Types._TQueries,
  TDeferred extends Types._TDeferred,
  TPayload extends Types._TPayload,
  TReturn extends unknown = Types.ResolveDataShape<
    Types.MakeDataRequired<TQueries>,
    TDeferred,
    TPayload
  >,
  TArg extends unknown = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<
    TProps,
    TQueries,
    TDeferred,
    TPayload,
    TReturn,
    TArg
  >
) => {
  return React.useRef(createLoader(createLoaderArgs)).current;
};
