import {
  AnyAction,
  createSlice,
  CreateSliceOptions,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { APISliceOpts, StateStatus } from "./types";
import { isFunction_, includesAll } from "./utils";

export { StateStatus } from "./types";

export const createAPISlice = <T extends Record<string, any>>(
  options: CreateSliceOptions<T>,
  apiSliceOptions?: APISliceOpts<T>
) => {
  const key = apiSliceOptions?.key ?? "state";
  const createSliceFunc =
    apiSliceOptions?.createSliceOverwrite ?? createSlice;
  const identifier = apiSliceOptions?.identifier ?? ":load";
  return createSliceFunc({
    ...options,
    extraReducers: (builder) => {
      if (
        options.extraReducers &&
        isFunction_(options.extraReducers)
      ) {
        options.extraReducers(builder);
      } else if (options.extraReducers) {
        Object.keys(options.extraReducers).forEach((key) =>
          builder.addCase(
            key,
            (options.extraReducers as any)[key]
          )
        );
      }
      builder
        .addMatcher(
          (action: AnyAction) =>
            includesAll(
              action.type,
              "/pending",
              options.name,
              identifier
            ),
          (state) => {
            (state as any)[key] = StateStatus.PENDING;
          }
        )
        .addMatcher(
          (action: AnyAction) =>
            includesAll(
              action.type,
              "/fulfilled",
              options.name,
              identifier
            ),
          (state) => {
            (state as any)[key] = StateStatus.FULFILLED;
          }
        )
        .addMatcher(
          (action: AnyAction) =>
            includesAll(
              action.type,
              "/rejected",
              options.name,
              identifier
            ),
          (state) => {
            (state as any)[key] = StateStatus.REJECTED;
          }
        );
    },
  });
};

export default createAPISlice;
