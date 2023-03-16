/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState } from "react";
import { aggregateToQuery } from "../../src/aggregateToQuery";
import { createLoader } from "../../src/createLoader";
import { InferLoaderData } from "../../src/types";
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
  useQueries: () => ({
    queries: {
      charizard: useGetPokemonByNameQuery("charizard"),
      pokemons: useGetPokemonsQuery(undefined),
    },
  }),
  onLoading: () => <div>Loading</div>,
});

export const SimpleLoadedComponent = withLoader(
  (_, loader) => (
    <RenderPokemonData
      pokemon={loader.queries.charizard.data}
      pokemons={loader.queries.pokemons.data}
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
      pokemon={loaderData.queries.charizard.data}
      pokemons={loaderData.queries.pokemons.data}
    />
  ),
  extendedLoader
);

const pokemonByNameLoader = createLoader({
  queriesArg: (props: { name: string }) => props.name,
  useQueries: (name) => {
    const pokemon = useGetPokemonByNameQuery(name);
    return {
      queries: {
        pokemon,
      },
    };
  },
});

export const LoadPokemon = withLoader(
  (props, { queries: { pokemon } }) => {
    return (
      <div>
        Loaded: "{pokemon.data.name}", props: "{props.name}"
      </div>
    );
  },
  pokemonByNameLoader
);

export const FailTester = withLoader(
  () => <div>Success</div>,
  createLoader({
    useQueries: () => ({
      queries: {
        error: useGetPokemonByNameQuery("error"),
      },
    }),
    onError: () => <div>Error</div>,
    onLoading: () => <div>Loading</div>,
  })
);

const fetchTestBaseLoader = createLoader({
  useQueries: (name: string) => ({
    queries: {
      pokemon: useGetPokemonByNameQuery(name),
    },
  }),
  queriesArg: (props: {
    name: string;
    onChange: (name: string) => void;
  }) => props.name,
  onLoading: () => <div>Loading</div>,
  onFetching: () => <div>Fetching</div>,
});

type FetchTestLoader = InferLoaderData<
  //  ^?
  typeof fetchTestBaseLoader
>;

const FetchTesterComponent = (
  props: {
    name: string;
    onChange: (name: string) => void;
  },
  loaderData: FetchTestLoader
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      #{loaderData.queries.pokemon.data.id}
      <br />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onChange(inputRef.current?.value ?? "");
        }}
      >
        <input type="text" ref={inputRef} />
        <button>Go</button>
      </form>
    </div>
  );
};

export const FetchTestRenderer = (props: {
  while?: boolean;
}) => {
  const [name, setName] = useState("charizard");

  if (props.while) {
    return <WhileFetchTester name={name} onChange={setName} />;
  }
  return <FetchTester name={name} onChange={setName} />;
};

export const FetchTester = withLoader(
  FetchTesterComponent,
  fetchTestBaseLoader
);

export const WhileFetchTester = withLoader(
  FetchTesterComponent,
  fetchTestBaseLoader.extend({
    whileFetching: { prepend: () => <div>FetchingWhile</div> },
    onFetching: undefined,
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

const transformLoader = createLoader({
  useQueries: () => ({
    queries: {
      charizard: useGetPokemonByNameQuery("charizard"),
    },
  }),
  transform: (loader) => ({
    pokemon: loader.queries.charizard.data,
  }),
});

export const TestTransformed = withLoader((_, loaderData) => {
  return <div>{loaderData.pokemon.name}</div>;
}, transformLoader);
