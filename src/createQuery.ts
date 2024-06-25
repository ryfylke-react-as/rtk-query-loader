import * as React from "react";
import * as Types from "./types";

type ReactType = typeof React;
let R = React;

let requestIdCount = 0;
const requestIdGenerator = () => {
  requestIdCount += 1;
  return `usecreatequery-${requestIdCount}`;
};

/**
 * Creates a query from an async getter function.
 * @param getter The async function to get the data.
 * @param dependencies The dependency array to watch for changes.
 * @example
 * const query = useCreateQuery(async () => {
 *  const response = await fetch(`/users/${userId}`);
 *  return response.json();
 * }, [userId]);
 */
export const useCreateQuery = <T extends unknown>(
  getter: Types.CreateQueryGetter<T>,
  dependencies?: any[]
): Types.UseQueryResult<T> => {
  const safeDependencies = dependencies ?? [];
  const [requestId] = R.useState(() => requestIdGenerator());
  const [state, dispatch] = R.useReducer(reducer, {
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
    originalArgs: safeDependencies,
    requestId,
    startedTimeStamp: 0,
  });

  const runQuery = (overrideInitialized?: boolean) => {
    const fetchData = async () => {
      try {
        const data = await getter();
        dispatch({ type: "success", payload: { data } });
      } catch (error) {
        dispatch({ type: "error", payload: { error } });
      }
    };

    dispatch({
      type: overrideInitialized
        ? "fetch"
        : state.isUninitialized
        ? "load"
        : "fetch",
      payload: { refetch: () => runQuery(true) },
    });

    fetchData();
  };

  R.useEffect(() => runQuery(), safeDependencies);

  return state as Types.UseQueryResult<T>;
};

export const _testCreateUseCreateQuery = (react: any) => {
  R = react as ReactType;
  return useCreateQuery;
};

const reducer = <T>(
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
        startedTimeStamp: Date.now(),
        refetch: action.payload.refetch,
      };
    case "fetch":
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: false,
        isFetching: true,
        isUninitialized: false,
        startedTimeStamp: Date.now(),
        refetch: action.payload.refetch,
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
        currentData: action.payload.data,
        fulfilledTimeStamp: Date.now(),
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
        fulfilledTimeStamp: Date.now(),
      };
    default:
      return state;
  }
};
