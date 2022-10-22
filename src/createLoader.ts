import { aggregateToQuery } from "./aggregateToQuery";
import * as Types from "./types";

export const createUseLoader = <
  QRU extends readonly Types.UseQueryResult<unknown>[],
  R extends unknown = QRU,
  A = never
>(
  createUseLoaderArgs: Types.CreateUseLoaderArgs<QRU, R, A>
): Types.UseLoader<A, R> => {
  return (...args) => {
    const createdQueries = createUseLoaderArgs.queries(...args);
    const aggregatedQuery = aggregateToQuery(createdQueries);

    if (aggregatedQuery.isSuccess) {
      const data = createUseLoaderArgs.transform
        ? createUseLoaderArgs.transform(createdQueries)
        : createdQueries;

      return {
        ...aggregatedQuery,
        data,
      } as Types.UseQueryResult<R>;
    }

    return aggregatedQuery as Types.UseQueryResult<R>;
  };
};

export const createLoader = <
  P extends unknown,
  QRU extends readonly Types.UseQueryResult<unknown>[],
  R extends unknown = QRU,
  A = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<P, QRU, R, A>
): Types.Loader<P, R, A> => {
  const useLoader = createUseLoader({
    queries: createLoaderArgs.queries,
    transform: createLoaderArgs.transform,
  });

  const loader: Types.Loader<P, R, A> = {
    useLoader,
    onLoading: createLoaderArgs.onLoading,
    onError: createLoaderArgs.onError,
    onFetching: createLoaderArgs.onFetching,
    queriesArg: createLoaderArgs.queriesArg,
    extend: function (args) {
      return { ...this, ...args } as Types.Loader<unknown, R, A>;
    },
  };

  return loader;
};

const loader = createLoader({
  queries: () => [],
});

const newLoader = loader.extend({});
