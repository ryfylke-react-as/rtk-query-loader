import * as React from "react";
import * as Types from "./types";

type ReactType = typeof React;
let R = React;

/**
 * Creates a query from an async getter function.
 *
 * ```ts
 * const query = useCreateQuery(async () => {
 *  const response = await fetch("https://example.com");
 *  return response.json();
 * });
 * ```
 */
export const useCreateQuery = <T extends unknown>(
  getter: Types.CreateQueryGetter<T>,
  dependencies?: any[]
): Types.UseQueryResult<T> => {
  const [state, dispatch] = R.useReducer(
    (
      state: Types.UseQueryResult<T>,
      action: Types.CreateQueryReducerAction<T>
    ) => {
      switch (action.type) {
        case "load":
          return {
            ...state,
            isSuccess: false,
            isError: false,
            isFetching: false,
            isLoading: true,
            isUninitialized: false,
          };
        case "fetch":
          return {
            ...state,
            isLoading: false,
            isSuccess: false,
            isError: false,
            isFetching: true,
            isUninitialized: false,
          };
        case "success":
          return {
            ...state,
            isLoading: false,
            isFetching: false,
            isError: false,
            isUninitialized: false,
            isSuccess: true,
            data: action.payload.data,
          };
        case "error":
          return {
            ...state,
            isLoading: false,
            isSuccess: false,
            isFetching: false,
            isUninitialized: false,
            isError: true,
            error: action.payload.error,
          };
        default:
          return state;
      }
    },
    {
      isLoading: true,
      isSuccess: false,
      isError: false,
      isFetching: false,
      refetch: () => {},
      isUninitialized: true,
      currentData: undefined,
      data: undefined,
      error: undefined,
      endpointName: "",
      fulfilledTimeStamp: 0,
      originalArgs: undefined,
      requestId: "",
      startedTimeStamp: 0,
    }
  );

  R.useEffect(() => {
    if (state.data === undefined) {
      dispatch({ type: "load" });
    } else {
      dispatch({ type: "fetch" });
    }
    const fetchData = async () => {
      try {
        const data = await getter();
        dispatch({ type: "success", payload: { data } });
      } catch (error) {
        dispatch({ type: "error", payload: { error } });
      }
    };

    fetchData();
  }, [...(dependencies ?? [])]);

  return state;
};

export const _testCreateUseCreateQuery = (react: any) => {
  R = react as ReactType;
  return useCreateQuery;
};
