import { aggregateToQuery } from "./aggregateToQuery";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export const createUseLoader = <
  QRU extends readonly Types.UseQueryResult<unknown>[],
  R extends unknown = Types.MakeDataRequired<QRU>,
  A = never
>(
  createUseLoaderArgs: Types.CreateUseLoaderArgs<QRU, R, A>
): Types.UseLoader<A, R> => {
  const useLoader = (...args: Types.OptionalGenericArg<A>) => {
    const createdQueries = createUseLoaderArgs.queries(...args);
    const aggregatedQuery = aggregateToQuery(createdQueries);

    if (aggregatedQuery.isSuccess) {
      const data = createUseLoaderArgs.transform
        ? createUseLoaderArgs.transform(
            createdQueries as unknown as Types.MakeDataRequired<QRU>
          )
        : createdQueries;

      return {
        ...aggregatedQuery,
        data,
        currentData: data,
        originalArgs: args,
      } as Types.UseQueryResult<R>;
    }

    return aggregatedQuery as Types.UseQueryResult<R>;
  };
  return useLoader;
};

export const createLoader = <
  P extends unknown,
  QRU extends readonly Types.UseQueryResult<unknown>[] = [],
  R extends unknown = Types.MakeDataRequired<QRU>,
  A = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<P, QRU, R, A>
): Types.Loader<P, R, QRU, A> => {
  const useLoader = createUseLoader({
    queries:
      createLoaderArgs.queries ?? (() => [] as unknown as QRU),
    transform: createLoaderArgs.transform,
  });

  const loader: Types.Loader<P, R, QRU, A> = {
    useLoader,
    onLoading: createLoaderArgs.onLoading,
    onError: createLoaderArgs.onError,
    onFetching: createLoaderArgs.onFetching,
    whileFetching: createLoaderArgs.whileFetching,
    queriesArg: createLoaderArgs.queriesArg,
    LoaderComponent:
      createLoaderArgs.loaderComponent ?? RTKLoader,
    extend: function <
      QRUb extends readonly Types.UseQueryResult<unknown>[],
      Pb extends unknown = P,
      Rb = QRUb extends unknown
        ? R
        : Types.MakeDataRequired<QRUb>,
      Ab = A
    >({
      queries,
      transform,
      ...loaderArgs
    }: Partial<Types.CreateLoaderArgs<Pb, QRUb, Rb, Ab>>) {
      const extendedLoader = {
        ...(this as unknown as Types.Loader<Pb, Rb, QRUb, Ab>),
        ...loaderArgs,
      } as Types.Loader<Pb, Rb, QRUb, Ab>;

      if (queries) {
        const newUseLoader = createUseLoader({
          queries,
          transform,
        });
        extendedLoader.useLoader = newUseLoader;
      }

      return extendedLoader;
    },
  };

  return loader;
};
