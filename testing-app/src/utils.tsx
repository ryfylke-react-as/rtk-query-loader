import { render, RenderOptions } from "@testing-library/react";
import React, { FC, ReactElement } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// override render method
export { customRender as render };
