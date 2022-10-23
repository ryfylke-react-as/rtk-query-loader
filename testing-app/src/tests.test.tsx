/* eslint-disable react-hooks/rules-of-hooks */
import {
  ExtendedLoaderComponent,
  FailTester,
  LoadPokemon,
  SimpleLoadedComponent,
  TestAggregateComponent,
} from "./testComponents";
import { render, screen, waitFor } from "./utils";

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

  describe(".extend()", () => {
    test("Can extend onLoading", async () => {
      render(<ExtendedLoaderComponent />);
      expect(screen.getByText("Extended loading")).toBeVisible();
    });
  });
});
