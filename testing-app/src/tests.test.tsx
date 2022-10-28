import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  DebouncedTester,
  ExtendedLoaderComponent,
  FailTester,
  FetchTestComponent,
  LoadPokemon,
  SimpleLoadedComponent,
  TestAggregateComponent,
  TestTransformed,
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

  test("onFetching renders when applicable", async () => {
    render(<FetchTestComponent />);
    expect(screen.getByText("Loading")).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toBeVisible()
    );
    const input = screen.getByRole("textbox");
    userEvent.type(input, "Abc{Enter}");
    await waitFor(() =>
      expect(screen.getByText("Fetching")).toBeVisible()
    );
    await waitFor(() =>
      expect(screen.getByText("#3")).toBeVisible()
    );
  });

  test("Can transform the output of the loader", async () => {
    render(<TestTransformed />);
    await waitFor(() =>
      expect(screen.getByText("charizard")).toBeVisible()
    );
  });

  const DebouncedTesterStateHolder = () => {
    const [name, setName] = useState("");
    return <DebouncedTester name={name} onChange={setName} />;
  };

  test("Can debounce the query", async () => {
    render(<DebouncedTesterStateHolder />);
    await waitFor(() =>
      expect(screen.queryByText("Loading")).toBeNull()
    );
    userEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByText(`"1"`)).toBeVisible()
    );
    userEvent.click(screen.getByRole("button"));
    userEvent.click(screen.getByRole("button"));
    userEvent.click(screen.getByRole("button"));
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByText(`"1"`)).toBeVisible();
    await waitFor(() =>
      expect(screen.getByText(`"2"`)).toBeVisible()
    );
  });

  describe(".extend()", () => {
    test("Can extend onLoading", async () => {
      render(<ExtendedLoaderComponent />);
      expect(screen.getByText("Extended loading")).toBeVisible();
    });
  });
});
