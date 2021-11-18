import {
  AnyAction,
  createSlice,
  CreateSliceOptions,
} from "@reduxjs/toolkit";
import { BaseDescription, StateStatus } from "./types";
import { isFunction_, includesAll } from "./utils";

export { StateStatus } from "./types";

export const createAPISlice = <T extends BaseDescription>(
  options: CreateSliceOptions<T>
) =>
  createSlice({
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
              ":load"
            ),
          (state) => {
            state.state = StateStatus.PENDING;
          }
        )
        .addMatcher(
          (action: AnyAction) =>
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
          (action: AnyAction) =>
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
