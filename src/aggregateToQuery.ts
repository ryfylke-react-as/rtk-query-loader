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
