import * as Types from "./types";

export const aggregateToQuery = <JoinedResponse>(
  queries: readonly Types.UseQueryResult<unknown>[]
): Types.UseQueryResult<JoinedResponse> => {
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const isFetching = queries.some((query) => query.isFetching);
  const isUninitialized = queries.some(
    (query) => query.isUninitialized
  );
  const isSuccess = !isUninitialized && !isLoading && !isError;
  const error = queries.find(
    (query) => query.error !== undefined
  )?.error;
  const fulfilledTimeStamp = Math.max(
    ...queries
      .filter(
        (query) => typeof query.fulfilledTimeStamp === "number"
      )
      .map((query) => query.fulfilledTimeStamp as number)
  );
  const startedTimeStamp = Math.max(
    ...queries
      .filter(
        (query) => typeof query.startedTimeStamp === "number"
      )
      .map((query) => query.startedTimeStamp as number)
  );
  const requestId = queries
    .filter((query) => typeof query.requestId === "string")
    .map((query) => query.requestId)
    .join("");

  const refetch = () => {
    queries.forEach((query) => query.refetch());
  };

  return {
    isLoading,
    isError,
    isFetching,
    isSuccess,
    isUninitialized,
    refetch,
    error,
    fulfilledTimeStamp,
    startedTimeStamp,
    requestId,
  };
};

export const createLoader = <
  QRU extends readonly Types.UseQueryResult<unknown>[],
  R extends unknown = QRU,
  A = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<QRU, R, A>
): Types.UseLoader<A, R> => {
  return (...args) => {
    const createdQueries = createLoaderArgs.queries(...args);
    const aggregatedQuery = aggregateToQuery(createdQueries);

    if (aggregatedQuery.isSuccess) {
      const data = createLoaderArgs.transform
        ? createLoaderArgs.transform(createdQueries)
        : createdQueries;

      return {
        ...aggregatedQuery,
        data,
      } as Types.UseQueryResult<R>;
    }

    return aggregatedQuery as Types.UseQueryResult<R>;
  };
};

export { RTKLoader } from "./RTKLoader";
export type {
  CreateLoaderArgs,
  CreateLoaderType,
  LoaderTransformFunction,
  OptionalGenericArg,
  UseLoader,
  UseQueryResult,
} from "./types";
export { withLoader } from "./withLoader";
export type { WithLoaderArgs } from "./withLoader";
