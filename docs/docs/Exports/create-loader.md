---
sidebar_position: 1
---

# createLoader

Creates a `Loader`.

Takes the following argument:

````typescript
type CreateLoaderArgs<
  P extends unknown, // Props
  QRU extends readonly UseQueryResult<unknown>[], // List of queries returned in `queries`
  QRUD extends readonly UseQueryResult<unknown>[], // List of queries returned in `deferredQueries`
  R extends unknown = MakeDataRequired<QRU>, // Return type
  A = never // Loader argument
> = {
  /** Should return a list of RTK useQuery results.
   * Example:
   * ```typescript
   * (args: Args) => [
   *    useGetPokemonQuery(args.pokemonId),
   *    useGetSomethingElse(args.someArg)
   * ] as const
   * ```
   */
  queries?: (...args: OptionalGenericArg<A>) => QRU;
  /** Should return a list of RTK useQuery results.
   * Example:
   * ```typescript
   * (args: Args) => [
   *    useGetPokemonQuery(args.pokemonId),
   *    useGetSomethingElse(args.someArg)
   * ] as const
   * ```
   */
  deferredQueries?: (...args: OptionalGenericArg<A>) => QRUD;
  /** Transforms the output of the queries */
  transform?: LoaderTransformFunction<QRU, QRUD, R>;
  /** Generates an argument for the `queries` based on component props */
  queriesArg?: (props: P) => A;
  /** Determines what to render while loading (with no data to fallback on) */
  onLoading?: (props: P) => ReactElement;
  /** Determines what to render when query fails. */
  onError?: (
    props: P,
    error: FetchBaseQueryError | SerializedError,
    joinedQuery: UseQueryResult<undefined>
  ) => ReactElement;
  /** @deprecated Using onFetching might result in loss of internal state. Use `whileFetching` instead, or pass the query to the component */
  onFetching?: (
    props: P,
    renderBody: () => ReactElement
  ) => ReactElement;
  /** Determines what to render besides success-result while query is fetching. */
  whileFetching?: WhileFetchingArgs<P, R>;
  /** The component to use to switch between rendering the different query states. */
  loaderComponent?: Component<CustomLoaderProps>;
};
```
````

oaijsdfoij
