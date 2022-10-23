/* eslint-disable react-hooks/rules-of-hooks */
import { aggregateToQuery } from "../../src/aggregateToQuery";
import { createLoader } from "../../src/createLoader";
import { withLoader } from "../../src/withLoader";
import {
  Pokemon,
  Pokemons,
  useGetPokemonByNameQuery,
  useGetPokemonsQuery,
} from "./store";

const RenderPokemonData = (props: {
  pokemon: Pokemon;
  pokemons: Pokemons;
}) => (
  <div>
    <h2>
      {props.pokemon.name}: {props.pokemon.id}
    </h2>
    <ul>
      {props.pokemons.results.map((item) => (
        <li key={item.name}>{item.name}</li>
      ))}
    </ul>
  </div>
);

const simpleLoader = createLoader({
  queries: () =>
    [
      useGetPokemonByNameQuery("charizard"),
      useGetPokemonsQuery(undefined),
    ] as const,
  onLoading: () => <div>Loading</div>,
});

export const SimpleLoadedComponent = withLoader(
  (props, loaderData) => (
    <RenderPokemonData
      pokemon={loaderData[0].data}
      pokemons={loaderData[1].data}
    />
  ),
  simpleLoader
);

const extendedLoader = simpleLoader.extend({
  onLoading: () => <div>Extended loading</div>,
});

export const ExtendedLoaderComponent = withLoader(
  (_, loaderData) => (
    <RenderPokemonData
      pokemon={loaderData[0].data}
      pokemons={loaderData[1].data}
    />
  ),
  extendedLoader
);

const pokemonByNameLoader = createLoader({
  queries: (name: string) =>
    [useGetPokemonByNameQuery(name)] as const,
  queriesArg: (props: { name: string }) => props.name,
});

export const LoadPokemon = withLoader((props, loaderData) => {
  return (
    <div>
      Loaded: "{loaderData[0].data.name}", props: "{props.name}"
    </div>
  );
}, pokemonByNameLoader);

export const FailTester = withLoader(
  () => <div>Success</div>,
  createLoader({
    queries: () => [useGetPokemonByNameQuery("error")] as const,
    onError: () => <div>Error</div>,
    onLoading: () => <div>Loading</div>,
  })
);

export const TestAggregateComponent = () => {
  const q1 = useGetPokemonByNameQuery("charizard");
  const q2 = useGetPokemonsQuery(undefined);
  const query = aggregateToQuery([q1, q2] as const);

  if (query.isSuccess) {
    return (
      <div>
        <h2>
          {q1.data?.name}: {q1?.data?.id}
        </h2>
        <ul>
          {q2.data?.results?.map((res) => (
            <li key={res.name}>{res.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>Loading</div>;
};
