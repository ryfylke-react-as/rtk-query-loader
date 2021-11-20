import {
  AnyAction,
  createSlice,
  CreateSliceOptions,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { APISliceOpts, StateStatus } from "./types";
import { isFunction_, includesAll } from "./utils";

export { StateStatus } from "./types";

const { PENDING, FULFILLED, REJECTED } = StateStatus;

export const createAPISlice = <T extends Record<string, any>>(
  options: CreateSliceOptions<T>,
  apiSliceOptions?: APISliceOpts<T>
) => {
  const key = apiSliceOptions?.key ?? "state";
  const createSliceFunc =
    apiSliceOptions?.createSliceOverwrite ?? createSlice;
  const identifier = apiSliceOptions?.identifier ?? ":load";

  const createMatch = (status: string) => (action: AnyAction) =>
    includesAll(action.type, status, options.name, identifier);

  const createStateSet =
    (status: StateStatus) => (state: any) => {
      state[key] = status;
    };

  return createSliceFunc({
    ...options,
    extraReducers: (builder) => {
      // Enrich final builder with the one the user created
      if (
        options.extraReducers &&
        isFunction_(options.extraReducers)
      ) {
        options.extraReducers(builder);
      } else if (options.extraReducers) {
        for (const key in Object.keys(options.extraReducers)) {
          builder.addCase(
            key,
            (options.extraReducers as any)[key]
          );
        }
      }
      // Add matches for automatic loading state
      builder
        .addMatcher(
          createMatch("/pending"),
          createStateSet(PENDING)
        )
        .addMatcher(
          createMatch("/fulfilled"),
          createStateSet(FULFILLED)
        )
        .addMatcher(
          createMatch("/rejected"),
          createStateSet(REJECTED)
        );
    },
  });
};

export default createAPISlice;
