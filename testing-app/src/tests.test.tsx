/* eslint-disable react-hooks/rules-of-hooks */
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createLoader } from "../../src/createLoader";
import { _testCreateUseCreateQuery } from "../../src/createQuery";
import { CustomLoaderProps } from "../../src/types";
import { withLoader } from "../../src/withLoader";
import {
  useGetPokemonByNameQuery,
  useGetPokemonsQuery,
} from "./store";
import {
  ExtendedLoaderComponent,
  FailTester,
  FetchTestRenderer,
  LoadPokemon,
  SimpleLoadedComponent,
  TestAggregateComponent,
} from "./testComponents";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "./utils";

const { useState } = React;

// We do this to avoid two conflicting versions of React
const useCreateQuery = _testCreateUseCreateQuery(React);

describe("aggregateToQuery", () => {
  test("It aggregates query status", async () => {
    render(<TestAggregateComponent />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard: 9")).toBeVisible()
    );
  });
});

describe("useCreateQuery", () => {
  test("It creates a query", async () => {
    const Component = withLoader(
      (props, queries) => <div>{queries[0].data.name}</div>,
      createLoader({
        queries: () => [
          useCreateQuery(async () => {
            await new Promise((resolve) =>
              setTimeout(resolve, 100)
            );
            return {
              name: "charizard",
            };
          }),
        ],
        onLoading: () => <div>Loading</div>,
      })
    );
    render(<Component />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });
  test("The query can throw error", async () => {
    const Component = withLoader(
      (props, queries) => <div>{queries[0].data.name}</div>,
      createLoader({
        queries: () =>
          [
            useCreateQuery(async () => {
              await new Promise((resolve, reject) =>
                setTimeout(
                  () => reject(new Error("error-message")),
                  100
                )
              );
              return {
                name: "charizard",
              };
            }),
          ] as const,
        onLoading: () => <div>Loading</div>,
        onError: (props, error) => (
          <div>{(error as any)?.message}</div>
        ),
      })
    );
    render(<Component />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("error-message")).toBeVisible()
    );
  });
});

describe("withLoader", () => {
  test("withLoader properly renders loading state until data is available", async () => {
    render(<SimpleLoadedComponent />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard: 9")).toBeVisible()
    );
    expect(screen.getByText("pikachu")).toBeVisible();
  });

  test("Loader passes props through queriesArg to queries", async () => {
    render(<LoadPokemon name="charizard" />);
    await waitFor(() =>
      expect(
        screen.getByText(
          'Loaded: "charizard", props: "charizard"'
        )
      ).toBeVisible()
    );
  });

  test("onError renders when applicable", async () => {
    render(<FailTester />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("Error")).toBeVisible()
    );
  });

  test("onFetching renders when applicable", async () => {
    render(<FetchTestRenderer />);
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading")
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toBeVisible()
    );
    const input = screen.getByRole("textbox");
    userEvent.type(input, "Abc{Enter}");
    await waitFor(() =>
      expect(screen.getByText("Fetching")).toBeVisible()
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Fetching")
    );
    await waitFor(() =>
      expect(screen.getByText("#3")).toBeVisible()
    );
  });

  test("Internal state won't reset when using whileFetching", async () => {
    render(<FetchTestRenderer while />);
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading")
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toBeVisible()
    );
    const input = screen.getByRole("textbox");
    userEvent.type(input, "Abc{Enter}");
    await waitFor(() =>
      expect(screen.getByText("FetchingWhile")).toBeVisible()
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByText("FetchingWhile")
    );
    await waitFor(() =>
      expect(screen.getByText("#3")).toBeVisible()
    );
    expect(screen.getByRole("textbox")).toHaveValue("Abc");
  });

  // Not wanted behavior, but expected behavior:
  test("Internal state will reset when using onFetching", async () => {
    render(<FetchTestRenderer />);
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Loading")
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toBeVisible()
    );
    const input = screen.getByRole("textbox");
    userEvent.type(input, "Abc{Enter}");
    await waitFor(() =>
      expect(screen.getByText("Fetching")).toBeVisible()
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Fetching")
    );
    await waitFor(() =>
      expect(screen.getByText("#3")).toBeVisible()
    );
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  test("Can use custom loader component", async () => {
    const CustomLoader = (props: CustomLoaderProps) => {
      if (props.query.isSuccess && props.query.data) {
        return props.onSuccess(props.query.data);
      }
      return <div>Custom loader!</div>;
    };

    const loader = createLoader({
      loaderComponent: CustomLoader,
      queries: () => [useGetPokemonByNameQuery("charizard")],
    });

    const Component = withLoader(
      (_, loaderData) => <div>{loaderData[0].data.name}</div>,
      loader
    );
    render(<Component />);
    expect(screen.getByText("Custom loader!")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });

  test("Can defer some queries", async () => {
    const Component = withLoader(
      (props, { charizard, delay }) => {
        return (
          <>
            <div>{charizard.name}</div>
            <div>
              {delay ? "loaded-deferred" : "loading-deferred"}
            </div>
          </>
        );
      },
      createLoader({
        queries: () =>
          [useGetPokemonByNameQuery("charizard")] as const,
        deferredQueries: () => {
          const delayQ = useGetPokemonByNameQuery("delay");
          return [delayQ] as const;
        },
        transform: (queries, deferred) => ({
          charizard: queries[0].data,
          delay: deferred[0].data,
        }),
        onLoading: () => <div>Loading</div>,
        onError: () => <div>Error</div>,
      })
    );
    render(<Component />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
    expect(screen.getByText("loading-deferred")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("loaded-deferred")).toBeVisible()
    );
  });

  test("Can defer all queries", async () => {
    const Component = withLoader(
      (props, data) => {
        if (data[0].isLoading) {
          return <>Loading</>;
        }
        return <>{data[0].data?.name}</>;
      },
      createLoader({
        deferredQueries: () =>
          [useGetPokemonByNameQuery("charizard")] as const,
        transform: (_, deferred) => deferred,
      })
    );
    render(<Component />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });

  test("Loaders with no queries render immediately", () => {
    const Component = withLoader(
      () => <div>Success</div>,
      createLoader({})
    );
    render(<Component />);
    expect(screen.getByText("Success")).toBeVisible();
  });

  describe(".extend()", () => {
    test("Can extend onLoading", async () => {
      render(<ExtendedLoaderComponent />);
      expect(screen.getByText("Extended loading")).toBeVisible();
    });

    test("Can extend onError", async () => {
      const Component = withLoader(
        (props, loaderData) => {
          return <div>Success</div>;
        },
        createLoader({
          queries: () =>
            [useGetPokemonByNameQuery("error")] as const,
          onLoading: () => <div>Loading</div>,
          onError: () => <div>Error</div>,
        }).extend({
          onError: () => <div>Extended Error</div>,
        })
      );
      render(<Component />);
      expect(screen.getByText("Loading")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByText("Extended Error")).toBeVisible()
      );
    });

    test("Can extend onFetching", async () => {
      const loader = createLoader({
        queries: (arg: string) =>
          [useGetPokemonByNameQuery(arg)] as const,
        queriesArg: (props: {
          name: string;
          onChange: (name: string) => void;
        }) => props.name,
        onLoading: () => <div>Loading</div>,
        onFetching: () => <div>Fetching</div>,
      }).extend({
        onFetching: () => <div>Extended Fetching</div>,
      });

      const Component = withLoader((props, loaderData) => {
        return (
          <div>
            Success <span>{loaderData[0].data.name}</span>
            <button
              onClick={() => props.onChange(props.name + "a")}
            >
              Refetch
            </button>
          </div>
        );
      }, loader);

      const Controller = () => {
        const [name, setName] = useState("a");
        return <Component name={name} onChange={setName} />;
      };

      render(<Controller />);
      expect(screen.getByText("Loading")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByRole("button")).toBeVisible()
      );
      await userEvent.click(screen.getByRole("button"));
      await waitFor(() =>
        expect(
          screen.getByText("Extended Fetching")
        ).toBeVisible()
      );
    });

    test("Can extend whileFetching", async () => {
      const loader = createLoader({
        queries: (arg: string) =>
          [useGetPokemonByNameQuery(arg)] as const,
        queriesArg: (props: {
          name: string;
          onChange: (name: string) => void;
        }) => props.name,
        onLoading: () => <div>Loading</div>,
        whileFetching: {
          prepend: () => <div>Fetching</div>,
        },
      }).extend({
        whileFetching: {
          prepend: () => <span>Extended Fetching</span>,
        },
      });
      expect(loader.whileFetching?.prepend).not.toBeUndefined();

      const Component = withLoader((props, loaderData) => {
        return (
          <div>
            Success <span>{loaderData[0].data.name}</span>
            <button
              onClick={() => props.onChange(props.name + "a")}
            >
              Refetch
            </button>
          </div>
        );
      }, loader);

      const Controller = () => {
        const [name, setName] = useState("a");
        return <Component name={name} onChange={setName} />;
      };

      render(<Controller />);
      expect(screen.getByText("Loading")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByRole("button")).toBeVisible()
      );
      await userEvent.click(screen.getByRole("button"));
      await waitFor(() =>
        expect(
          screen.queryByText(/extended fetching/i)
        ).toBeVisible()
      );
    });

    test("Can extend queries", async () => {
      const loader = createLoader({
        queries: (arg: string) =>
          [useGetPokemonByNameQuery(arg)] as const,
        queriesArg: (props: { name: string }) => props.name,
        onLoading: () => <div>Loading</div>,
      }).extend({
        queries: (arg: string) =>
          [
            useGetPokemonByNameQuery(arg),
            useGetPokemonsQuery(undefined),
          ] as const,
      });

      const Component = withLoader((props, loaderData) => {
        return (
          <div>
            <ul>
              <li>{loaderData[0].data.name}</li>
              {loaderData[1].data.results.map((pokemon) => (
                <li key={pokemon.name}>{pokemon.name}</li>
              ))}
            </ul>
          </div>
        );
      }, loader);

      render(<Component name="test" />);
      expect(screen.getByText("Loading")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByText("test")).toBeVisible()
      );
      expect(screen.getByText(/charizard/i)).toBeVisible();
      expect(screen.getByText(/pikachu/i)).toBeVisible();
    });

    test("Can extend deferred queries", async () => {
      const Component = withLoader(
        (props, { charizard, delay }) => {
          return (
            <>
              <div>{charizard.name}</div>
              <div>
                {delay ? "loaded-deferred" : "loading-deferred"}
              </div>
            </>
          );
        },
        createLoader({
          queries: () =>
            [useGetPokemonsQuery(undefined)] as const,
          deferredQueries: () =>
            [useGetPokemonByNameQuery("charizard")] as const,
        }).extend({
          queries: () =>
            [useGetPokemonByNameQuery("charizard")] as const,
          deferredQueries: () => {
            const delayQ = useGetPokemonByNameQuery("delay");
            return [delayQ] as const;
          },
          transform: (queries, deferred) => ({
            charizard: queries[0].data,
            delay: deferred[0].data,
          }),
          onLoading: () => <div>Loading</div>,
          onError: () => <div>Error</div>,
        })
      );
      render(<Component />);
      expect(screen.getByText("Loading")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByText("charizard")).toBeVisible()
      );
      expect(screen.getByText("loading-deferred")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByText("loaded-deferred")).toBeVisible()
      );
    });
  });
});
