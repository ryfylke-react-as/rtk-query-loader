/* eslint-disable react-hooks/rules-of-hooks */
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { createLoader } from "../../src/createLoader";
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

describe("aggregateToQuery", () => {
  test("It aggregates query status", async () => {
    render(<TestAggregateComponent />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("charizard: 9")).toBeVisible()
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

  test("Can defer one of two queries", async () => {
    const loader = createLoader({
      queries: () => {
        // Queries that are not deferred should be called first
        const notDeferred = useGetPokemonsQuery(undefined);
        const notDeferred2 = useGetPokemonsQuery(undefined);
        // Queries that are deferred should be called last
        const deferred = useGetPokemonByNameQuery("charizard");
        return [
          deferred, // 100ms slower than useGetPokemonsQuery
          notDeferred2,
          notDeferred,
        ] as const;
      },
      deferred: (cr) => [
        cr({ name: "temp-charizard" }),
        undefined,
        undefined,
      ],
      onLoading: () => <div>Loading</div>,
    });
    const Component = withLoader(
      (_, loaderData) => (
        <>
          <div>{loaderData[0].data.name}</div>
        </>
      ),
      loader
    );
    render(<Component />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText("temp-charizard")).toBeVisible()
    );
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });

  test("Can defer all queries", async () => {
    const loader = createLoader({
      queries: () =>
        [
          useGetPokemonsQuery(undefined),
          useGetPokemonByNameQuery("charizard"),
        ] as const,
      deferred: (cr) => [
        cr({ results: [] }),
        cr({ name: "temp-charizard" }),
      ],
      onLoading: () => <div>Loading</div>,
    });
    const Component = withLoader(
      (_, loaderData) => (
        <>
          <div>{loaderData[1].data.name}</div>
          <div>{loaderData[0]?.data ? "Loaded" : "💩"}</div>
        </>
      ),
      loader
    );
    render(<Component />);

    expect(screen.getByText("temp-charizard")).toBeVisible();
    expect(screen.getByText("Loaded")).toBeVisible();

    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
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
  });
});
