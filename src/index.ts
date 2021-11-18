import {
  AnyAction,
  AsyncThunk,
  createSlice,
  CreateSliceOptions,
} from "@reduxjs/toolkit";

import { BaseDescription, StateStatus } from "./types";

export { StateStatus } from "./types";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<
  GenericAsyncThunk["fulfilled"]
>;

const includesAll = (
  textToCheck: string,
  ...texts: string[]
) => {
  return texts.every((text) => textToCheck.includes(text));
};

export const createAPISlice = <T extends BaseDescription>(
  options: CreateSliceOptions<T>
) =>
  createSlice({
    ...options,
    extraReducers: (builder) => {
      if (
        options.extraReducers &&
        {}.toString.call(options.extraReducers) ===
          "[object Function]"
      ) {
        (options.extraReducers as any)?.(builder);
      } else if (options.extraReducers) {
        Object.keys(options.extraReducers).forEach((key) => {
          builder.addCase(
            key,
            (options.extraReducers as any)[key]
          );
        });
      }
      builder
        .addMatcher(
          (action: AnyAction): action is PendingAction =>
            includesAll(
              action.type,
              "/pending",
              options.name,
              ":load"
            ),
          (state) => {
            state.state = StateStatus.PENDING;
          }
        )
        .addMatcher(
          (action: AnyAction): action is FulfilledAction =>
            includesAll(
              action.type,
              "/fulfilled",
              options.name,
              ":load"
            ),
          (state) => {
            state.state = StateStatus.FULFILLED;
          }
        )
        .addMatcher(
          (action: AnyAction): action is RejectedAction =>
            includesAll(
              action.type,
              "/rejected",
              options.name,
              ":load"
            ),
          (state) => {
            state.state = StateStatus.REJECTED;
          }
        );
    },
  });

export default createAPISlice;
