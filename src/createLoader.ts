import { aggregateToQuery } from "./aggregateToQuery";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export const createUseLoader = <
  Q extends Types._Q,
  D extends Types._D,
  E extends Types._E,
  R extends unknown = Types.ResolveDataShape<
    Types.MakeDataRequired<Q>,
    D,
    E
  >,
  A = never
>(
  createUseLoaderArgs: Types.CreateUseLoaderArgs<Q, D, E, R, A>
): Types.UseLoader<A, R> => {
  const useLoader = (...args: Types.OptionalGenericArg<A>) => {
    const loaderRes = createUseLoaderArgs.useQueries(...args);
    const queriesList = loaderRes.queries
      ? Object.keys(loaderRes.queries).map(
          (key) => (loaderRes.queries as Q)[key]
        )
      : [];
    const aggregatedQuery = aggregateToQuery(queriesList);

    if (aggregatedQuery.isSuccess || queriesList.length === 0) {
      const data = createUseLoaderArgs.transform
        ? createUseLoaderArgs.transform(
            loaderRes as Types.ResolveDataShape<
              Types.MakeDataRequired<Q>,
              D,
              E
            >
          )
        : loaderRes;

      return {
        ...aggregatedQuery,
        isSuccess: true,
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
  Q extends Types._Q,
  D extends Types._D,
  E extends Types._E,
  R extends unknown = Types.ResolveDataShape<
    Types.MakeDataRequired<Q>,
    D,
    E
  >,
  A extends unknown = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<P, Q, D, E, R, A>
): Types.Loader<P, R, Q, D, E, A> => {
  const useLoader = createUseLoader({
    useQueries:
      createLoaderArgs.useQueries ??
      (() => ({} as unknown as Q)),
    transform: createLoaderArgs.transform,
  });

  const loader: Types.Loader<P, R, Q, D, E, A> = {
    useLoader,
    onLoading: createLoaderArgs.onLoading,
    onError: createLoaderArgs.onError,
    onFetching: createLoaderArgs.onFetching,
    whileFetching: createLoaderArgs.whileFetching,
    queriesArg: createLoaderArgs.queriesArg,
    LoaderComponent:
      createLoaderArgs.loaderComponent ?? RTKLoader,
    extend: function <
      Qb extends Types._Q,
      Db extends Types._D = Types._D,
      Eb extends Types._E = Types._E,
      Pb extends unknown = P,
      Rb = Qb extends unknown
        ? R
        : Types.ResolveDataShape<
            Types.MakeDataRequired<Qb>,
            Db,
            Eb
          >,
      Ab extends unknown = A
    >({
      useQueries,
      transform,
      ...loaderArgs
    }: Partial<Types.CreateLoaderArgs<Pb, Qb, Db, Eb, Rb, Ab>>) {
      const extendedLoader = {
        ...(this as unknown as Types.Loader<
          Pb,
          Rb,
          Qb,
          Db,
          Eb,
          Ab
        >),
        ...loaderArgs,
      } as Types.Loader<Pb, Rb, Qb, Db, Eb, Ab>;

      if (useQueries) {
        const newUseLoader = createUseLoader({
          useQueries,
          transform,
        });
        extendedLoader.useLoader = newUseLoader;
      }

      return extendedLoader;
    },
  };

  return loader;
};
