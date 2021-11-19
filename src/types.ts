import {
  CreateSliceOptions,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

export enum StateStatus {
  IDLE,
  PENDING,
  FULFILLED,
  REJECTED,
}

export type APISliceOpts<T> = {
  /** The key that stores the StateStatus in the slice. Default `state`. */
  key?: string;
  /** The identifier used to add loading state. Default `:load` */
  identifier?: string;
  /** Replaces the createSlice function used internally */
  createSliceOverwrite?: (
    options: CreateSliceOptions<T, SliceCaseReducers<T>, string>
  ) => any;
};

export type BaseDescription<T extends string> = Record<
  T,
  StateStatus
>;
