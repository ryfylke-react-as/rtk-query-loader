import { configureStore } from "@reduxjs/toolkit";
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query/react";

export type Pokemon = {
  id: number;
  name: string;
};

export type Pokemons = {
  results: {
    name: string;
  }[];
};

export const someApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://google.com/",
  }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name || "charizard"}`,
    }),
    getPokemons: builder.query<Pokemons, undefined>({
      query: () => `pokemons`,
    }),
  }),
});

export const { useGetPokemonByNameQuery, useGetPokemonsQuery } =
  someApi;

export const store = configureStore({
  reducer: {
    [someApi.reducerPath]: someApi.reducer,
  },
  middleware: (getdefaultMiddleware) =>
    getdefaultMiddleware().concat([someApi.middleware]),
});
