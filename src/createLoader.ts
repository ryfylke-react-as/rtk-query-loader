import { aggregateToQuery } from "./aggregateToQuery";
import { useCreateQuery } from "./createQuery";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

export const createUseLoader = <
  Q extends Types._Q,
  D extends Types._D,
  E extends Types._E,
  R extends unknown = Types.DataShape<
    Types.MakeDataRequired<Q>,
    D,
    E
  >,
  A = never
>(
  createUseLoaderArgs: Types.CreateUseLoaderArgs<Q, D, E, R, A>
): Types.UseLoader<A, R> => {
  const useLoader = (...args: Types.OptionalGenericArg<A>) => {
    const loaderRes = createUseLoaderArgs.useQuery(...args);
    const queriesList = loaderRes.queries
      ? Object.keys(loaderRes.queries).map(
          (key) => (loaderRes.queries as Q)[key]
        )
      : [];
    const aggregatedQuery = aggregateToQuery(queriesList);

    if (aggregatedQuery.isSuccess || queriesList.length === 0) {
      const data = createUseLoaderArgs.transform
        ? createUseLoaderArgs.transform(loaderRes)
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
  Q extends Types._Q = Types._Q,
  D extends Types._D = Types._D,
  E extends Types._E = Types._E,
  R extends unknown = Types.DataShape<
    Types.MakeDataRequired<Q>,
    D,
    E
  >,
  A extends unknown = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<P, Q, D, E, R, A>
): Types.Loader<P, R, Q, D, E, A> => {
  const useLoader = createUseLoader({
    useQuery:
      createLoaderArgs.useQuery ?? (() => ({} as unknown as Q)),
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
        : Types.DataShape<Types.MakeDataRequired<Qb>, Db, Eb>,
      Ab = A
    >({
      useQuery,
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

      if (useQuery) {
        const newUseLoader = createUseLoader({
          useQuery,
          transform,
        });
        extendedLoader.useLoader = newUseLoader;
      }

      return extendedLoader;
    },
  };

  return loader;
};

const loader = createLoader({
  queriesArg: (props: {}) => "test",
  useQuery: (arg) => {
    const q1 = useCreateQuery(async () => "foo" as const);
    const q2 = useCreateQuery(async () => "bar" as const);
    return {
      queries: {
        q1,
      },
      deferredQueries: {
        q2,
      },
    };
  },
});
