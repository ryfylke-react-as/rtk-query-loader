import userEvent from "@testing-library/user-event";
import * as React from "react";
import { createLoader } from "../../src/createLoader";
import { _testCreateUseCreateQuery } from "../../src/createQuery";
import { CustomLoaderProps } from "../../src/types";
import { withLoader } from "../../src/withLoader";
import { _testLoad } from "../../src/AwaitLoader";
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
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { render } from "./utils";
import { expect, describe, test } from "vitest";

const { useState } = React;

// We do this to avoid two conflicting versions of React
const useCreateQuery = _testCreateUseCreateQuery(React);
const AwaitLoader = _testLoad(React);

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
      (props, queries) => (
        <div>{queries.queries.q.data.name}</div>
      ),
      createLoader({
        useQueries: () => ({
          queries: {
            q: useCreateQuery(async () => {
              await new Promise((resolve) =>
                setTimeout(resolve, 100)
              );
              return {
                name: "charizard",
              };
            }),
          },
        }),
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
      (props, loader) => <div>{loader.queries.q.data.name}</div>,
      createLoader({
        useQueries: () => ({
          queries: {
            q: useCreateQuery(async () => {
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
          },
        }),
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
  test("You can refetch the query", async () => {
    let count = 0;
    const Component = withLoader(
      (props, queries) => {
        return (
          <div>
            {queries.queries.q.isFetching ? "fetch" : "success"}{" "}
            <button onClick={queries.queries.q.refetch}>
              refetch
            </button>
            <div>{queries.queries.q.data.count}</div>
          </div>
        );
      },
      createLoader({
        useQueries: () => ({
          queries: {
            q: useCreateQuery(async () => {
              count++;
              await new Promise((resolve) =>
                setTimeout(resolve, 300)
              );
              return {
                name: "charizard",
                count,
              };
            }),
          },
        }),
        onLoading: () => <div>Loading</div>,
      })
    );
    render(<Component />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("success")).toBeVisible()
    );
    expect(screen.getByText("1")).toBeVisible();
    await userEvent.click(screen.getByText("refetch"));

    await waitFor(() =>
      expect(screen.getByText("fetch")).toBeVisible()
    );

    await waitFor(() =>
      expect(screen.getByText("success")).toBeVisible()
    );
    expect(screen.getByText("2")).toBeVisible();
  });
});

describe("<AwaitLoader />", () => {
  test("Renders loading state until data is available", async () => {
    const loader = createLoader({
      useQueries: () => ({
        queries: {
          charizard: useGetPokemonByNameQuery("charizard"),
        },
      }),
      onLoading: () => <div>Loading</div>,
    });
    const Component = () => {
      return (
        <div>
          <AwaitLoader
            loader={loader}
            render={(data) => (
              <div>{data.queries.charizard.data.name}</div>
            )}
          />
        </div>
      );
    };
    render(<Component />);

    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });

  test("Will pass arguments properly", async () => {
    const loader = createLoader({
      queriesArg: (props: { name: string }) => props.name,
      useQueries: (name) => ({
        queries: {
          charizard: useGetPokemonByNameQuery(name),
        },
      }),
      onLoading: () => <div>Loading</div>,
    });
    const Component = () => {
      return (
        <div>
          <AwaitLoader
            loader={loader}
            render={(data) => (
              <div>{data.queries.charizard.data.name}</div>
            )}
            args={{
              name: "charizard",
            }}
          />
        </div>
      );
    };
    render(<Component />);

    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });
});

describe("withLoader", () => {
  test("Renders loading state until data is available", async () => {
    render(<SimpleLoadedComponent />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard: 9")).toBeVisible()
    );
    expect(screen.getByText("pikachu")).toBeVisible();
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
      config: { loaderComponent: CustomLoader },
      useQueries: () => ({
        queries: {
          charizard: useGetPokemonByNameQuery("charizard"),
        },
      }),
    });

    const Component = withLoader(
      (_, loaderData) => (
        <div>{loaderData.queries.charizard.data.name}</div>
      ),
      loader
    );
    render(<Component />);
    expect(screen.getByText("Custom loader!")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });

  test("loaderComponent is backwards compatible", async () => {
    const CustomLoader = (props: CustomLoaderProps) => {
      if (props.query.isSuccess && props.query.data) {
        return props.onSuccess(props.query.data);
      }
      return <div>Custom loader!</div>;
    };
    const Component = withLoader(
      (_, loaderData) => (
        <div>{loaderData.queries.charizard.data.name}</div>
      ),
      createLoader({
        loaderComponent: CustomLoader,
        useQueries: () => ({
          queries: {
            charizard: useGetPokemonByNameQuery("charizard"),
          },
        }),
      })
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
        useQueries: () => ({
          queries: {
            charizard: useGetPokemonByNameQuery("charizard"),
          },
          deferredQueries: {
            delay: useGetPokemonByNameQuery("delay"),
          },
        }),
        transform: (loader) => ({
          charizard: loader.queries.charizard.data,
          delay: loader.deferredQueries.delay.data,
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
        if (data.isLoading) {
          return <>Loading</>;
        }
        return <>{data.data?.name}</>;
      },
      createLoader({
        useQueries: () => ({
          deferredQueries: {
            charizard: useGetPokemonByNameQuery("charizard"),
          },
        }),
        transform: (loaderData) =>
          loaderData.deferredQueries.charizard,
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
});

describe("createLoader", () => {
  test("Normally, deferred queries do not throw", async () => {
    const Component = withLoader(
      (props, data) => {
        return <div>Hello</div>;
      },
      createLoader({
        useQueries: () => ({
          deferredQueries: {
            charizard: useGetPokemonByNameQuery("error"),
          },
        }),
      })
    );
    render(<Component />);
    await waitFor(
      () => new Promise((res) => setTimeout(res, 200))
    );
    expect(screen.getByText("Hello")).toBeVisible();
  });

  test("Deferred queries throw error when configured to", async () => {
    const Component = withLoader(
      (props, data) => {
        return <div>Hello</div>;
      },
      createLoader({
        useQueries: () => ({
          deferredQueries: {
            charizard: useGetPokemonByNameQuery("error"),
          },
        }),
        config: {
          deferred: {
            shouldThrowError: true,
          },
        },
        onError: () => <div>Error</div>,
      })
    );
    render(<Component />);
    await waitFor(
      () => new Promise((res) => setTimeout(res, 200))
    );
    expect(screen.getByText("Error")).toBeVisible();
  });

  test("Can send static payload to loader", async () => {
    const Component = withLoader(
      (_, loader) => {
        return <div>{loader.payload.foo}</div>;
      },
      createLoader({
        useQueries: () => ({
          payload: {
            foo: "bar" as const,
          },
        }),
      })
    );
    render(<Component />);
    expect(screen.getByText("bar")).toBeVisible();
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
          useQueries: () => {
            const error = useGetPokemonByNameQuery("error");
            return {
              queries: {
                error,
              },
            };
          },
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
        useQueries: (arg) => ({
          queries: {
            pokemon: useGetPokemonByNameQuery(arg),
          },
        }),
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
            Success{" "}
            <span>{loaderData.queries.pokemon.data.name}</span>
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
        useQueries: (arg: string) => ({
          queries: {
            pokemon: useGetPokemonByNameQuery(arg),
          },
        }),
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
            Success{" "}
            <span>{loaderData.queries.pokemon.data.name}</span>
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
        useQueries: (arg: string) => ({
          queries: {
            pokemon: useGetPokemonByNameQuery(arg),
          },
        }),
        queriesArg: (props: { name: string }) => props.name,
        onLoading: () => <div>Loading</div>,
      }).extend({
        useQueries: (arg: string) => ({
          queries: {
            pokemon: useGetPokemonByNameQuery(arg),
            pokemons: useGetPokemonsQuery(undefined),
          },
        }),
      });

      const Component = withLoader((props, loaderData) => {
        return (
          <div>
            <ul>
              <li>{loaderData.queries.pokemon.data.name}</li>
              {loaderData.queries.pokemons.data.results.map(
                (pokemon) => (
                  <li key={pokemon.name}>{pokemon.name}</li>
                )
              )}
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

    test.skip("Can extend deferred queries", async () => {
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
          useQueries: () => ({
            queries: {
              pokemons: useGetPokemonsQuery(undefined),
            },
            deferredQueries: {
              charizard: useGetPokemonByNameQuery("charizard"),
            },
          }),
        }).extend({
          useQueries: () => ({
            queries: {
              charizard: useGetPokemonByNameQuery("charizard"),
            },
            deferredQueries: {
              delay: useGetPokemonByNameQuery("delay"),
            },
          }),
          transform: (loader) => ({
            charizard: loader.queries.charizard.data,
            delay: loader.deferredQueries.delay.data,
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

    test("Can extend many times", async () => {
      const Component = withLoader(
        (props, loader) => {
          return (
            <div>
              <div>{loader.queries.pokemon.data.name}</div>
              <div>{loader.foobar}</div>
              <button
                onClick={() => loader.payload.setName("error")}
              >
                error
              </button>
            </div>
          );
        },
        createLoader({
          onLoading: () => <div>Loading</div>,
        })
          .extend({
            useQueries: () => {
              const [name, setName] = useState("charizard");
              return {
                queries: {
                  pokemon: useGetPokemonByNameQuery(name),
                },
                payload: {
                  name,
                  setName,
                },
              };
            },
          })
          .extend({
            onLoading: () => <div>Extended Loading One</div>,
          })
          .extend({
            onError: () => <div>Extended Error</div>,
          })
          .extend({
            transform: (data) => ({ ...data, foobar: "foobar" }),
          })
          .extend({
            onLoading: () => <div>Extended Loading Two</div>,
          })
      );

      render(<Component />);
      expect(
        screen.getByText("Extended Loading Two")
      ).toBeVisible();
      await waitFor(() =>
        expect(screen.getByText("charizard")).toBeVisible()
      );
      expect(screen.getByText("foobar")).toBeVisible();
      await userEvent.click(screen.getByRole("button"));
      await waitFor(() =>
        expect(screen.getByText("Extended Error")).toBeVisible()
      );
    });

    test("Can extend with only transform", async () => {
      const Component = withLoader(
        (props, pokemon) => {
          return <div>{pokemon.name}</div>;
        },
        createLoader({
          useQueries: () => ({
            queries: {
              pokemon: useGetPokemonByNameQuery("charizard"),
            },
          }),
        }).extend({
          transform: (data) => data.queries.pokemon.data,
        })
      );
      render(<Component />);
      await waitFor(() =>
        expect(screen.getByText("charizard")).toBeVisible()
      );
    });

    test("Can partially extend config", async () => {
      const CustomLoader = (props: CustomLoaderProps) => {
        if (props.query.isError) {
          return <div>Custom error!</div>;
        }
        if (props.query.isSuccess && props.query.data) {
          return props.onSuccess(props.query.data);
        }
        return <div>Custom loader!</div>;
      };

      const loader = createLoader({
        config: {
          loaderComponent: CustomLoader,
          deferred: { shouldThrowError: true },
        },
        useQueries: () => ({
          queries: {
            charizard: useGetPokemonByNameQuery("charizard"),
          },
          deferredQueries: {
            charizard: useGetPokemonByNameQuery("error"),
          },
        }),
      }).extend({
        config: {
          deferred: { shouldThrowError: false },
        },
      });

      const Component = withLoader(
        (_, loaderData) => (
          <div>{loaderData.queries.charizard.data.name}</div>
        ),
        loader
      );
      render(<Component />);

      // We expect that the custom loader is rendered,
      // But that the deferredQuery does not cause component to render error view
      expect(screen.getByText("Custom loader!")).toBeVisible();
      await waitFor(() =>
        expect(screen.getByText("charizard")).toBeVisible()
      );
    });
  });
});
