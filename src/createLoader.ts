import { aggregateToQuery } from "./aggregateToQuery";
import { RTKLoader } from "./RTKLoader";
import * as Types from "./types";

const mergeConfig = (
  original: Types.LoaderConfig,
  extended: Types.LoaderConfig
): Types.LoaderConfig => {
  if (!original) return extended;
  return {
    ...original,
    ...extended,
    deferred: {
      ...original.deferred,
      ...extended.deferred,
    },
  };
};

export const createUseLoader = <
  TQueries extends Types._TQueries,
  TDeferred extends Types._TDeferred,
  TPayload extends Types._TPayload,
  TReturn extends unknown = Types.ResolveDataShape<
    Types.MakeDataRequired<TQueries>,
    TDeferred,
    TPayload
  >,
  TArg = never
>(
  createUseLoaderArgs: Types.CreateUseLoaderArgs<
    TQueries,
    TDeferred,
    TPayload,
    TReturn,
    TArg
  >
): Types.UseLoader<
  TArg,
  TReturn,
  TQueries,
  TDeferred,
  TPayload
> => {
  const useLoader = (
    ...args: Types.OptionalGenericArg<TArg>
  ) => {
    const loaderRes = createUseLoaderArgs.useQueries(...args);
    const queriesList = loaderRes.queries
      ? Object.keys(loaderRes.queries).map(
          (key) => (loaderRes.queries as TQueries)[key]
        )
      : [];
    const aggregatedQuery = aggregateToQuery(queriesList);
    if (createUseLoaderArgs.config?.deferred?.shouldThrowError) {
      if (loaderRes.deferredQueries) {
        const deferredQueriesList = Object.keys(
          loaderRes.deferredQueries
        ).map(
          (key) => (loaderRes.deferredQueries as TDeferred)[key]
        );
        if (deferredQueriesList.some((q) => q.isError)) {
          aggregatedQuery.isError = true;
          aggregatedQuery.error = deferredQueriesList.find(
            (q) => q.isError
          )?.error;
        }
      }
    }

    if (aggregatedQuery.isSuccess || queriesList.length === 0) {
      const data = createUseLoaderArgs.transform
        ? createUseLoaderArgs.transform(
            loaderRes as Types.ResolveDataShape<
              Types.MakeDataRequired<TQueries>,
              TDeferred,
              TPayload
            >
          )
        : loaderRes;

      return {
        ...aggregatedQuery,
        isSuccess: true,
        data,
        currentData: data,
        originalArgs: args,
      } as Types.UseQueryResult<TReturn>;
    }

    return aggregatedQuery as Types.UseQueryResult<TReturn>;
  };

  useLoader.original_args = createUseLoaderArgs;
  return useLoader;
};

export const createLoader = <
  TProps extends unknown,
  TQueries extends Types._TQueries,
  TDeferred extends Types._TDeferred,
  TPayload extends Types._TPayload,
  TReturn extends unknown = Types.ResolveDataShape<
    Types.MakeDataRequired<TQueries>,
    TDeferred,
    TPayload
  >,
  TArg extends unknown = never
>(
  createLoaderArgs: Types.CreateLoaderArgs<
    TProps,
    TQueries,
    TDeferred,
    TPayload,
    TReturn,
    TArg
  >
): Types.Loader<
  TProps,
  TReturn,
  TQueries,
  TDeferred,
  TPayload,
  TArg
> => {
  const useLoader = createUseLoader({
    useQueries:
      createLoaderArgs.useQueries ??
      (() => ({} as unknown as TQueries)),
    transform: createLoaderArgs.transform,
    config: createLoaderArgs.config,
  });

  const loader: Types.Loader<
    TProps,
    TReturn,
    TQueries,
    TDeferred,
    TPayload,
    TArg
  > = {
    useLoader,
    onLoading: createLoaderArgs.onLoading,
    onError: createLoaderArgs.onError,
    onFetching: createLoaderArgs.onFetching,
    whileFetching: createLoaderArgs.whileFetching,
    queriesArg: createLoaderArgs.queriesArg,
    config: createLoaderArgs.config,
    LoaderComponent:
      createLoaderArgs.config?.loaderComponent ??
      createLoaderArgs.loaderComponent ??
      RTKLoader,
    extend: function <
      E_TQueries extends Types._TQueries = TQueries,
      E_TDeferred extends Types._TDeferred = TDeferred,
      E_TPayload extends Types._TPayload = TPayload,
      E_TReturn extends unknown = Types.AllEql<
        TQueries,
        E_TQueries,
        TDeferred,
        E_TDeferred,
        TPayload,
        E_TPayload
      > extends true
        ? TReturn
        : Types.ResolveLoadedDataShape<
            E_TQueries,
            E_TDeferred,
            E_TPayload
          >,
      E_TProps extends unknown = TProps,
      E_TArg = TArg
    >({
      useQueries,
      transform,
      ...loaderArgs
    }: Partial<
      Types.CreateLoaderArgs<
        E_TProps,
        E_TQueries,
        E_TDeferred,
        E_TPayload,
        E_TReturn,
        E_TArg
      >
    >) {
      const original = this as unknown as Types.Loader<
        E_TProps,
        E_TReturn,
        E_TQueries,
        E_TDeferred,
        E_TPayload,
        E_TArg
      >;
      const mergedConfig = mergeConfig(
        original.config ?? {},
        loaderArgs.config ?? {}
      );

      // For backwards support of `loaderComponent
      if (
        !mergedConfig.loaderComponent &&
        loaderArgs.loaderComponent
      ) {
        mergedConfig.loaderComponent =
          loaderArgs.loaderComponent;
      }
      const extendedLoader: Types.Loader<
        E_TProps,
        E_TReturn,
        E_TQueries,
        E_TDeferred,
        E_TPayload,
        E_TArg
      > = {
        ...original,
        ...loaderArgs,
        config: mergedConfig,
      };

      if (useQueries) {
        const newUseLoader = createUseLoader({
          useQueries,
          transform,
          config: mergedConfig,
        });
        extendedLoader.useLoader = newUseLoader;
      } else if (transform) {
        const newUseLoader = createUseLoader({
          useQueries:
            extendedLoader.useLoader.original_args.useQueries,
          transform,
          config: mergedConfig,
        });
        extendedLoader.useLoader = newUseLoader;
      }

      return extendedLoader;
    },
  };

  return loader;
};
